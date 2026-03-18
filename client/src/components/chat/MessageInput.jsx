import React, { useContext, useState } from "react";
import assets from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import toast from "react-hot-toast";

const MessageInput = ({ replyTo, onReplyCancel, typingTimeoutRef }) => {
  const { sendMessage, selectedUser } = useContext(ChatContext);
  const { socket } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket && selectedUser?._id) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && selectedUser?._id) {
        socket.emit("stopTyping", { receiverId: selectedUser._id });
      }
    }, 1500);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (input.trim() === "" && !previewImage) return;
    if (socket && selectedUser?._id) {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    await sendMessage({
      text: input.trim(),
      replyTo: replyTo?._id?.toString() || null,
    });

    setInput("");
    onReplyCancel?.();
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({
        image: reader.result,
        replyTo: replyTo?._id?.toString() || null,
      });
      e.target.value = "";
      setPreviewImage(null);
      onReplyCancel?.();
    };
    reader.readAsDataURL(file);
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
    handleSendImage(e);
  };

  return (
    <div className="shrink-0 border-t border-white/[0.06] bg-white/[0.02]">
      {previewImage && (
        <div className="px-4 pt-2">
          <div className="relative inline-block">
            <img
              src={previewImage}
              alt="preview"
              className="h-14 w-14 rounded-xl object-cover border border-white/15"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-2">
        <input
          onChange={handleImagePreview}
          type="file"
          id="chat-image"
          accept="image/png,image/jpg,image/jpeg"
          hidden
        />
        <label
          htmlFor="chat-image"
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 cursor-pointer transition-colors"
        >
          <img
            src={assets.gallery_icon}
            className="w-4 h-4 opacity-50"
            alt="gallery"
          />
        </label>

        <div className="flex-1 flex items-center bg-white/[0.06] border border-white/[0.08] rounded-2xl px-4 py-2.5 min-w-0 focus-within:border-violet-500/40 transition-colors">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey ? handleSend(e) : null
            }
            placeholder="Message..."
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/20 min-w-0"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() && !previewImage}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
        >
          <img src={assets.send_button} alt="send" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;