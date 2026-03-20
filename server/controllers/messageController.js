import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// ──────────────────────────────────────────
// GET USERS FOR SIDEBAR
// ──────────────────────────────────────────
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (count > 0) unseenMessages[user._id] = count;
    });
    await Promise.all(promises);

    res
      .status(200)
      .json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("getUserForSidebar error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// GET MESSAGES
// ──────────────────────────────────────────
export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
      deletedForEveryone: false,
      deletedFor: { $ne: myId },
    })
      .populate("replyTo", "text image senderId") // replyTo populate karo
      .sort({ createdAt: 1 });

    // Messages seen mark karo
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, status: { $ne: "seen" } },
      { status: "seen" },
    );

    // Sender ko real-time seen notify karo
    const senderSocketId = userSocketMap[selectedUserId.toString()];
    if (senderSocketId) {
      messages
        .filter((msg) => msg.senderId.toString() === selectedUserId.toString())
        .forEach((msg) => {
          io.to(senderSocketId).emit("messageSeen", { messageId: msg._id });
        });
    }

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("getMessage error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// MARK MESSAGE AS SEEN
// ──────────────────────────────────────────
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { status: "seen" },
      { returnDocument: "after" },
    );

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    const senderSocketId = userSocketMap[message.senderId.toString()];
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSeen", { messageId: id });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("markMessageAsSeen error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// SEND MESSAGE
// ──────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body; // replyTo add kiya
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty" });
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat-app/messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const receiverSocketId = userSocketMap[receiverId.toString()];
    const initialStatus = receiverSocketId ? "delivered" : "sent";

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      status: initialStatus,
      replyTo: replyTo || null, // replyTo save karo
    });

    // replyTo populate karke bhejo taaki frontend pe show ho
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "replyTo",
      "text image senderId",
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    if (initialStatus === "delivered") {
      const senderSocketId = userSocketMap[senderId.toString()];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", {
          messageId: newMessage._id,
        });
      }
    }

    res.status(201).json({ success: true, newMessage: populatedMessage });
  } catch (error) {
    console.error("sendMessage error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// DELETE MESSAGE
// ──────────────────────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteType } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    if (deleteType === "forEveryone") {
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Only sender can delete for everyone",
        });
      }

      await Message.findByIdAndUpdate(id, { deletedForEveryone: true });

      const receiverSocketId = userSocketMap[message.receiverId.toString()];
      const senderSocketId = userSocketMap[message.senderId.toString()];

      const payload = { messageId: id, deleteType: "forEveryone" };
      if (receiverSocketId)
        io.to(receiverSocketId).emit("messageDeleted", payload);
      if (senderSocketId) io.to(senderSocketId).emit("messageDeleted", payload);
    } else {
      await Message.findByIdAndUpdate(id, {
        $addToSet: { deletedFor: userId },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteMessage error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// REACT TO MESSAGE
// ──────────────────────────────────────────
export const reactToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res
        .status(400)
        .json({ success: false, message: "Emoji is required" });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    const existingIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString(),
    );

    if (existingIndex !== -1) {
      if (message.reactions[existingIndex].emoji === emoji) {
        message.reactions.splice(existingIndex, 1); // Toggle off
      } else {
        message.reactions[existingIndex].emoji = emoji; // Replace
      }
    } else {
      message.reactions.push({ userId, emoji }); // New reaction
    }

    await message.save();

    const payload = { messageId: id, reactions: message.reactions };
    const receiverSocketId = userSocketMap[message.receiverId.toString()];
    const senderSocketId = userSocketMap[message.senderId.toString()];

    if (receiverSocketId)
      io.to(receiverSocketId).emit("messageReaction", payload);
    if (senderSocketId) io.to(senderSocketId).emit("messageReaction", payload);

    res.status(200).json({ success: true, reactions: message.reactions });
  } catch (error) {
    console.error("reactToMessage error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
