import { Smile } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const EmojiReaction = ({
  messageId,
  isMine,
  currentReactions = [],
  authUserId,
  onReact,
  showButtonOnly = false,
  showReactionsOnly = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const myReaction = currentReactions.find(
    (r) => r.userId?.toString() === authUserId?.toString(),
  )?.emoji;

  const groupedReactions = currentReactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  const calculatePos = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const pickerWidth = showFullPicker ? 280 : 320;
    const pickerHeight = showFullPicker ? 200 : 90;

    let top = rect.top - pickerHeight - 8;
    let left = isMine ? rect.right - pickerWidth : rect.left;

    if (top < 8) top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + pickerWidth > window.innerWidth - 8) {
      left = window.innerWidth - pickerWidth - 8;
    }

    // Mobile fix — thoda kam upar
    if (window.innerWidth < 768) {
      top = rect.top - pickerHeight + 20;
      left = left + 20;
    }

    setPickerPos({ top, left });
  };

  const handleOpenPicker = () => {
    calculatePos();
    setShowPicker((p) => !p);
    setShowFullPicker(false);
  };

  const handleOpenFullPicker = () => {
    calculatePos();
    setShowFullPicker(true);
    setShowPicker(false);
  };

  const handleReact = (emoji) => {
    onReact(messageId, emoji);
    setShowPicker(false);
    setShowFullPicker(false);
  };

  // Sirf reaction bubbles
  if (showReactionsOnly) {
    return (
      <div
        className={`flex items-center flex-wrap gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}
      >
        {Object.entries(groupedReactions).map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
              border transition-all duration-150 active:scale-95
              ${
                myReaction === emoji
                  ? "bg-violet-500/30 border-violet-500/50 text-white"
                  : "bg-white/8 border-white/10 text-white/70 hover:bg-white/15"
              }
            `}
          >
            <span className="text-sm">{emoji}</span>
            {count > 1 && (
              <span className="text-[10px] font-medium">{count}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Emoji trigger button */}
      <div ref={btnRef}>
        <button
          onClick={handleOpenPicker}
          className={`
            w-6 h-6 rounded-full flex items-center justify-center text-base
            opacity-0 group-hover:opacity-100
            bg-[#1a1730] border border-white/10
            hover:bg-white/10 hover:scale-110
            transition-all duration-150 shadow-sm
            ${showPicker || showFullPicker ? "!opacity-100" : ""}
          `}
          title="React"
        >
          <Smile className="text-white/90 "/>
        </button>
      </div>

      {/* Quick picker — fixed position */}
      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowPicker(false)}
          />
          <div
            style={{ top: pickerPos.top, left: pickerPos.left }}
            className="fixed z-[9999] bg-[#13102a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.7)] flex items-center gap-1"
          >
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center text-xl
                  hover:bg-white/10 hover:scale-125 transition-all duration-150
                  ${myReaction === emoji ? "bg-violet-500/30 scale-110" : ""}
                `}
              >
                {emoji}
              </button>
            ))}
            <button
              onClick={handleOpenFullPicker}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150 border border-white/10 text-lg font-light"
            >
              +
            </button>
          </div>
        </>
      )}

      {/* Full picker — fixed position */}
      {showFullPicker && (
        <>
          <div
            className="fixed inset-0 z-[50]"
            onClick={() => setShowFullPicker(false)}
          />
          <div
            style={{ top: pickerPos.top, left: pickerPos.left }}
            className="fixed z-[9999] w-[280px] bg-[#13102a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3 shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
          >
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 px-1">
              Reactions
            </p>
            <div className="grid grid-cols-8 gap-1">
              {[
                "👍",
                "👎",
                "❤️",
                "🔥",
                "😂",
                "😮",
                "😢",
                "🙏",
                "🎉",
                "👏",
                "💯",
                "✅",
                "😍",
                "🤔",
                "😡",
                "🥳",
                "💪",
                "🤝",
                "👋",
                "🙌",
                "😎",
                "🤣",
                "😭",
                "💀",
                "🫡",
                "🤯",
                "😱",
                "🥹",
                "💔",
                "⭐",
                "🚀",
                "💡",
              ].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-lg
                    hover:bg-white/10 hover:scale-125 transition-all duration-150
                    ${myReaction === emoji ? "bg-violet-500/30 scale-110" : ""}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EmojiReaction;