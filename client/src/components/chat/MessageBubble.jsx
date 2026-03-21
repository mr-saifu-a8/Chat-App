import React, { useContext, useRef } from "react";
import { Reply, ChevronDown, Check } from "lucide-react";
import { formatMassageTime } from "../../library/utils";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import MessageMenu from "../message/MessageMenu";
import MessageStatus from "../message/MessageStatus";
import EmojiReaction from "../message/EmojiReaction";

const MessageBubble = ({
  msg,
  isFirst,
  isLast,
  onReply,
  // Selection props
  isSelecting,
  isSelected,
  onSelect,
}) => {
  const { authUser } = useContext(AuthContext);
  const { selectedUser, deleteMessage, reactToMessage } =
    useContext(ChatContext);
  const openMenuRef = useRef(null);
  const isMine = msg.senderId?.toString() === authUser._id?.toString();

  const handleBubbleClick = () => {
    if (isSelecting) {
      onSelect?.(msg._id);
    }
  };

  return (
    <div
      className={`
        flex w-full px-4
        ${isMine ? "justify-end" : "justify-start"}
        ${isLast ? "mb-3" : "mb-0.5"}
        ${isSelected ? "bg-violet-500/10" : ""}
        ${isSelecting ? "cursor-pointer" : ""}
        transition-colors duration-150 rounded-lg
      `}
      onClick={handleBubbleClick}
    >
      {/* Selection checkbox — left ya right */}
      {isSelecting && (
        <div
          className={`
          flex items-center shrink-0
          ${isMine ? "order-last ml-2" : "order-first mr-2"}
        `}
        >
          <div
            className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-150
            ${
              isSelected
                ? "bg-violet-500 border-violet-500"
                : "border-white/30 bg-white/5"
            }
          `}
          >
            {isSelected && (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      )}

      <div
        className={`
        flex items-end gap-2
        max-w-[80%] sm:max-w-[72%]
        ${isMine ? "flex-row" : "flex-row-reverse"}
        ${isSelecting ? "" : "group"}
      `}
      >
        {/* Emoji — selection mode mein hide */}
        {!isSelecting && (
          <div
            className="md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity duration-150 flex shrink-0 mb-1"
            onClick={(e) => e.stopPropagation()}
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
        )}

        {/* Bubble */}
        <div className="relative min-w-0 flex-1">
          {/* Arrow — selection mode mein hide */}
          {!isSelecting && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openMenuRef.current?.(e.clientX, e.clientY);
              }}
              className={`
                absolute top-1 right-1 z-20
                w-5 h-5 rounded-full
                items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-opacity duration-150
                hidden md:flex
                ${
                  isMine
                    ? "bg-violet-700/60 hover:bg-violet-700/90"
                    : "bg-black/25 hover:bg-black/45"
                }
              `}
            >
              <ChevronDown className="w-3 h-3 text-white/90" />
            </button>
          )}

          <MessageMenu
            messageId={msg._id}
            isMine={isMine}
            message={msg}
            onDelete={deleteMessage}
            onSelect={(id) => {
              // MessageMenu se select — selection mode shuru karo
              onSelect?.(id, true);
            }}
            onReply={onReply}
            onForward={(m) => console.log("Forward:", m)}
            onRegisterOpen={(fn) => {
              openMenuRef.current = fn;
            }}
            disabled={isSelecting}
          >
            <div
              className={`
              flex flex-col w-full
              ${isMine ? "items-end" : "items-start"}
              ${isSelected ? (isMine ? "opacity-90" : "opacity-90") : ""}
            `}
            >
              {msg.replyTo && (
                <div
                  className={`
                  w-full mb-1 overflow-hidden rounded-xl border-l-[3px] border-violet-400
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
                          : selectedUser?.fullName}
                      </p>
                      {msg.replyTo.image ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={msg.replyTo.image}
                            alt="replied"
                            className="w-8 h-8 rounded-md object-cover shrink-0"
                          />
                          <p className="text-[11px] text-white/45">📷 Photo</p>
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

              {msg.image ? (
                <img
                  src={msg.image}
                  alt="shared"
                  className={`
                    max-w-full cursor-pointer hover:opacity-90 transition-opacity rounded-2xl border
                    ${isSelected ? "border-violet-400/50" : "border-white/10"}
                  `}
                  onClick={(e) => {
                    if (isSelecting) return;
                    e.stopPropagation();
                    window.open(msg.image);
                  }}
                />
              ) : (
                <div
                  className={`
                  px-3.5 py-2 text-sm leading-relaxed text-white break-words break-all w-full
                  transition-all duration-150
                  ${
                    isSelected
                      ? isMine
                        ? "bg-violet-500/90 rounded-2xl"
                        : "bg-violet-500/30 rounded-2xl"
                      : isMine
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

              {isLast && (
                <div
                  className={`flex items-center gap-1 mt-1 px-0.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                >
                  <p className="text-[10px] text-white/20">
                    {formatMassageTime(msg.createdAt)}
                  </p>
                  {isMine && <MessageStatus status={msg.status || "sent"} />}
                </div>
              )}
            </div>
          </MessageMenu>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;