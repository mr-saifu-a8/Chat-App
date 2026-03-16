import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMassageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import MessageStatus from "./MessageStatus";
import MessageMenu from "./MessageMenu";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    isTyping,
    deleteMessage,
  } = useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);

  const scrollEnd = useRef();
  const typingTimeoutRef = useRef(null);
  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    if (socket && selectedUser?._id) {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
      setPreviewImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
    handleSendImage(e);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-4 bg-transparent">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <img
            src={assets.logo_icon}
            className="w-8 h-8 opacity-60"
            alt="logo"
          />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-white/70">
            Select a conversation
          </p>
          <p className="text-sm text-white/30 mt-1">
            Choose from your existing chats
          </p>
        </div>
      </div>
    );
  }

  const isSelectedUserOnline = onlineUsers.some(
    (id) => id?.toString() === selectedUser._id?.toString(),
  );

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/8 transition-colors"
        >
          <img src={assets.arrow_icon} alt="back" className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser.fullName}
            className="w-9 h-9 rounded-full object-cover"
          />
          {isSelectedUserOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {selectedUser.fullName}
          </p>
          {isTyping ? (
            <p className="text-xs text-emerald-400/80 animate-pulse">
              typing...
            </p>
          ) : (
            <p
              className={`text-xs ${isSelectedUserOnline ? "text-emerald-400/80" : "text-white/30"}`}
            >
              {isSelectedUserOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {}}
            title="Audio Call"
            className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
          >
            <svg
              className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>

          <button
            onClick={() => {}}
            title="Video Call"
            className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
          >
            <svg
              className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button className="hidden md:flex p-2 rounded-xl hover:bg-white/8 transition-colors group">
            <img
              src={assets.help_icon}
              alt="help"
              className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity"
            />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg, index) => {
          const isMine = msg.senderId?.toString() === authUser._id?.toString();

          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 group ${isMine ? "justify-end" : "justify-start"}`}
            >
              {!isMine && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0 mb-5"
                />
              )}

              <div
                className={`flex items-end gap-1.5 max-w-[72%] md:max-w-[58%] ${isMine ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Message menu — hover pe dikhega */}
                <div className="shrink-0 mb-5">
                  <MessageMenu
                    messageId={msg._id}
                    isMine={isMine}
                    onDelete={deleteMessage}
                    messageText={msg.text || null}
                  />
                </div>

                <div
                  className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
                >
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="max-w-full rounded-2xl border border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(msg.image)}
                    />
                  ) : (
                    <div
                      className={`
                      px-4 py-2.5 rounded-2xl text-sm leading-relaxed text-white break-words
                      ${isMine ? "bg-violet-600/75 rounded-br-sm" : "bg-white/10 rounded-bl-sm"}
                    `}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Time + Status */}
                  <div className="flex items-center gap-1 px-1">
                    <p className="text-[10px] text-white/25">
                      {formatMassageTime(msg.createdAt)}
                    </p>
                    {isMine && <MessageStatus status={msg.status || "sent"} />}
                  </div>
                </div>
              </div>

              {isMine && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0 mb-5"
                />
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt=""
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={scrollEnd} />
      </div>

      {/* Image preview */}
      {previewImage && (
        <div className="shrink-0 px-4 pb-2">
          <div className="relative inline-block">
            <img
              src={previewImage}
              alt="preview"
              className="h-14 w-14 rounded-lg object-cover border border-white/15"
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

      {/* Input bar */}
      <div className="shrink-0 px-4 py-3 border-t border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-white/6 border border-white/8 rounded-xl px-4 py-2.5 min-w-0">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey ? handleSendMessage(e) : null
              }
              placeholder="Write a message..."
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/30 min-w-0"
            />
            <input
              onChange={handleImagePreview}
              type="file"
              id="image"
              accept="image/png,image/jpg,image/jpeg"
              hidden
            />
            <label
              htmlFor="image"
              className="shrink-0 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <img
                src={assets.gallery_icon}
                className="w-4 h-4 opacity-40 hover:opacity-80 transition-opacity"
                alt="gallery"
              />
            </label>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() && !previewImage}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
          >
            <img src={assets.send_button} alt="send" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;