// import Message from "../models/Message.js"
// import User from "../models/User.js";
// import cloudinary from "../lib/cloudinary.js";
// import { io, userSocketMap } from "../server.js";

// export const getUserForSidebar = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const filteredUser = await User.find({ _id: { $ne: userId } }).select(
//       "-password",
//     );

//     // Count number of message not seen
//     const unseenMessage = {};
//     const promises = filteredUser.map(async (user) => {
//       const messages = await Message.find({
//         senderId: user._id,
//         receiverId: userId,
//         seen: false,
//       });

//       if (messages.length > 0) {
//         unseenMessage[user._id] = messages.length;
//       }
//     });
//     await Promise.all(promises);
//     res.json({ success: true, users: filteredUser, unseenMessage });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Get all message for selected user

// export const getMessage = async (req, res) => {
//   try {
//     const { id: selectedUserId } = req.params
//     const myId = req.user._id

//     const message = await Message.find({
//       $or: [
//         { senderId: myId, receiverId, selectedUserId },
//         {senderId: selectedUserId, receiverId: myId}
//       ]
//     })

//     await Message.updateMany({ senderId: selectedUserId, receiverId: myId })
//     {seen: true}
//     res.json({success: true, message})
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // api to mark message as seen using message id

// export const markMessageAsSeen = async (req, res) => {
//   try {
//     const { id } = req.params
//     await Message.findByIdAndUpdate(id, { seen: true })
//     res.json({success: true})
//   } catch (error) {
//         console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// }

// // send message to selected user

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body
//     const receiverId = req.params.id
//     const senderId = req.user._id

//     let imageUrl;
//     if (image) {
//       const uploadResponse = await cloudinary.uploader.upload(image)
//       imageUrl = uploadResponse.secure_url
//     }

//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl
//     })

//     //Emit the new message to the receiver's socket
//     const receiverSocketId = userSocketMap[receiverId]
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage)
//     }

//     res.json({success: true, newMessage})

//   } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message });

//   }
// }

import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// ──────────────────────────────────────────
// GET ALL USERS FOR SIDEBAR
// ──────────────────────────────────────────
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    // Har user ke unseen messages count karo
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
// GET MESSAGES FOR SELECTED USER
// ──────────────────────────────────────────
export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId }, // receiverId fix — comma tha
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Purane messages pehle

    // Seen update karo — curly braces bahar thi, isiliye kaam nahi kar raha tha
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true },
    );

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
    await Message.findByIdAndUpdate(id, { seen: true });
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
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // Text aur image dono empty nahi hone chahiye
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

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    // Receiver online hai toh socket se real-time bhejo
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error("sendMessage error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};