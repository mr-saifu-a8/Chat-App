import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMassageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import MessageStatus from "./MessageStatus";
import MessageMenu from "./MessageMenu";
import EmojiReaction from "./EmojiReaction";
import { X, Reply } from "lucide-react";
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
    reactToMessage,
  } = useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);

  const scrollEnd = useRef();
  const typingTimeoutRef = useRef(null);
  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    setReplyTo(null);
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
    setReplyTo(null);
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
      setReplyTo(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
    handleSendImage(e);
  };

  // ── Empty state ──
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

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const label = getDateLabel(msg.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
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
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
          />
          {isSelectedUserOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate leading-tight">
            {selectedUser.fullName}
          </p>
          {isTyping ? (
            <p className="text-xs text-emerald-400/80 animate-pulse">
              typing...
            </p>
          ) : (
            <p
              className={`text-xs ${isSelectedUserOnline ? "text-emerald-400/70" : "text-white/25"}`}
            >
              {isSelectedUserOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => {}}
            title="Audio Call"
            className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
          >
            <svg
              className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors"
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
              className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors"
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
              className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity"
            />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4 px-4">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] text-white/25 font-medium px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                {dateLabel}
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="space-y-0.5">
              {msgs.map((msg, index) => {
                const isMine =
                  msg.senderId?.toString() === authUser._id?.toString();
                const prevMsg = msgs[index - 1];
                const nextMsg = msgs[index + 1];
                const isFirst =
                  !prevMsg ||
                  prevMsg.senderId?.toString() !== msg.senderId?.toString();
                const isLast =
                  !nextMsg ||
                  nextMsg.senderId?.toString() !== msg.senderId?.toString();

                return (
                  <div
                    key={msg._id || index}
                    className={`
                      flex w-full px-3
                      ${isMine ? "justify-end" : "justify-start"}
                      ${isLast ? "mb-3" : "mb-0.5"}
                    `}
                  >
                    {/* Max width container — yahan control karo */}
                    <div className="relative group max-w-[80%] sm:max-w-[72%] min-w-0">
                      {/* Emoji button — message ke bahar side mein */}
                      <div
                        className={`
                        absolute top-1 z-10
                        ${isMine ? "-left-8" : "-right-8"}
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-150
                      `}
                      >
                        <EmojiReaction
                          messageId={msg._id}
                          isMine={isMine}
                          currentReactions={msg.reactions || []}
                          authUserId={authUser._id}
                          onReact={reactToMessage}
                          showButtonOnly={true}
                        />
                      </div>

                      {/* MessageMenu wraps sirf bubble ko */}
                      <MessageMenu
                        messageId={msg._id}
                        isMine={isMine}
                        message={msg}
                        onDelete={deleteMessage}
                        onSelect={(id) => console.log("Selected:", id)}
                        onReply={(m) => setReplyTo(m)}
                        onForward={(m) => console.log("Forward:", m)}
                      >
                        {/* Bubble content */}
                        <div
                          className={`
                          flex flex-col w-full
                          ${isMine ? "items-end" : "items-start"}
                        `}
                        >
                          {/* Reply preview — bubble ke andar */}
                          {msg.replyTo && (
                            <div
                              className={`
                              w-full mb-1 overflow-hidden
                              rounded-xl border-l-[3px] border-violet-400
                              ${isMine ? "bg-violet-900/30 rounded-br-sm" : "bg-white/[0.07] rounded-bl-sm"}
                            `}
                            >
                              <div className="flex items-center gap-2 px-3 py-2">
                                <Reply className="w-3 h-3 text-violet-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-violet-400 mb-0.5">
                                    {msg.replyTo.senderId?.toString() ===
                                    authUser._id?.toString()
                                      ? "You"
                                      : selectedUser.fullName}
                                  </p>
                                  {msg.replyTo.image ? (
                                    <div className="flex items-center gap-1.5">
                                      <img
                                        src={msg.replyTo.image}
                                        alt="replied"
                                        className="w-8 h-8 rounded-md object-cover shrink-0"
                                      />
                                      <p className="text-[11px] text-white/45">
                                        📷 Photo
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-white/45 truncate leading-tight">
                                      {msg.replyTo.text}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Image or text */}
                          {msg.image ? (
                            <img
                              src={msg.image}
                              alt="shared"
                              className="max-w-full cursor-pointer hover:opacity-90 transition-opacity rounded-2xl border border-white/10"
                              onClick={() => window.open(msg.image)}
                            />
                          ) : (
                            <div
                              className={`
                              px-3.5 py-2 text-sm leading-relaxed text-white
                              break-words break-all w-full
                              ${
                                isMine
                                  ? `bg-violet-600/80
                                   ${msg.replyTo ? "rounded-b-2xl rounded-tl-2xl rounded-tr-sm" : isFirst ? "rounded-t-2xl" : "rounded-t-lg"}
                                   ${!msg.replyTo && isLast ? "rounded-bl-2xl rounded-br-sm" : ""}
                                   ${!msg.replyTo && !isLast ? "rounded-b-lg" : ""}`
                                  : `bg-white/[0.09]
                                   ${msg.replyTo ? "rounded-b-2xl rounded-tr-2xl rounded-tl-sm" : isFirst ? "rounded-t-2xl" : "rounded-t-lg"}
                                   ${!msg.replyTo && isLast ? "rounded-br-2xl rounded-bl-sm" : ""}
                                   ${!msg.replyTo && !isLast ? "rounded-b-lg" : ""}`
                              }
                            `}
                            >
                              {msg.text}
                            </div>
                          )}

                          {/* Reactions */}
                          {msg.reactions?.length > 0 && (
                            <EmojiReaction
                              messageId={msg._id}
                              isMine={isMine}
                              currentReactions={msg.reactions || []}
                              authUserId={authUser._id}
                              onReact={reactToMessage}
                              showReactionsOnly={true}
                            />
                          )}

                          {/* Time + status */}
                          {isLast && (
                            <div
                              className={`
                              flex items-center gap-1 mt-1 px-0.5
                              ${isMine ? "flex-row-reverse" : "flex-row"}
                            `}
                            >
                              <p className="text-[10px] text-white/20">
                                {formatMassageTime(msg.createdAt)}
                              </p>
                              {isMine && (
                                <MessageStatus status={msg.status || "sent"} />
                              )}
                            </div>
                          )}
                        </div>
                      </MessageMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start px-4 mt-2 mb-3">
            <div className="bg-white/[0.09] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={scrollEnd} />
      </div>

      {/* ── Reply preview — input ke upar ── */}
      {replyTo && (
        <div className="shrink-0 mx-4 mt-2 mb-1">
          <div
            className="
            flex items-center gap-3
            bg-white/[0.05] border border-white/[0.08]
            border-l-[3px] border-l-violet-500
            rounded-xl px-3 py-2.5
          "
          >
            <Reply className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-violet-400 mb-0.5">
                Replying to{" "}
                {replyTo.senderId?.toString() === authUser._id?.toString()
                  ? "yourself"
                  : selectedUser.fullName}
              </p>
              {replyTo.image ? (
                <div className="flex items-center gap-2">
                  <img
                    src={replyTo.image}
                    alt="reply"
                    className="w-7 h-7 rounded-md object-cover shrink-0"
                  />
                  <p className="text-xs text-white/40">📷 Photo</p>
                </div>
              ) : (
                <p className="text-xs text-white/40 truncate">{replyTo.text}</p>
              )}
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-white/50" />
            </button>
          </div>
        </div>
      )}

      {/* ── Image preview ── */}
      {previewImage && (
        <div className="shrink-0 px-4 py-2">
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

      {/* ── Input bar ── */}
      <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <input
            onChange={handleImagePreview}
            type="file"
            id="image"
            accept="image/png,image/jpg,image/jpeg"
            hidden
          />
          <label
            htmlFor="image"
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
                e.key === "Enter" && !e.shiftKey ? handleSendMessage(e) : null
              }
              placeholder="Message..."
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/20 min-w-0"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() && !previewImage}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
          >
            <img src={assets.send_button} alt="send" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;