import React, { useState, useRef, useEffect } from "react";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const EmojiReaction = ({
  messageId,
  isMine,
  currentReactions = [],
  authUserId,
  onReact,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);
  const pickerRef = useRef(null);

  // My current reaction
  const myReaction = currentReactions.find(
    (r) => r.userId?.toString() === authUserId?.toString(),
  )?.emoji;

  // Click outside close
  useEffect(() => {
    if (!showPicker && !showFullPicker) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
        setShowFullPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker, showFullPicker]);

  // Group reactions by emoji
  const groupedReactions = currentReactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  const handleReact = (emoji) => {
    onReact(messageId, emoji);
    setShowPicker(false);
    setShowFullPicker(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Emoji trigger button — hover pe dikhta hai */}
      <button
        onClick={() => setShowPicker((p) => !p)}
        className={`
          w-6 h-6 rounded-full flex items-center justify-center
          opacity-0 group-hover:opacity-100
          bg-white/8 hover:bg-white/15
          border border-white/10
          transition-all duration-150 text-sm
          ${showPicker ? "!opacity-100" : ""}
        `}
        title="React"
      >
        {myReaction || "😊"}
      </button>

      {/* Quick emoji picker */}
      {showPicker && (
        <div
          className={`
          absolute z-[1000] bottom-full mb-2
          bg-[#13102a]/95 backdrop-blur-xl
          border border-white/[0.08]
          rounded-2xl p-2
          shadow-[0_16px_48px_rgba(0,0,0,0.7)]
          flex items-center gap-1
          ${isMine ? "right-0" : "left-0"}
        `}
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className={`
                w-9 h-9 rounded-xl flex items-center justify-center text-xl
                hover:bg-white/10 hover:scale-125
                transition-all duration-150
                ${myReaction === emoji ? "bg-violet-500/30 scale-110" : ""}
              `}
            >
              {emoji}
            </button>
          ))}

          {/* + button — full picker */}
          <button
            onClick={() => {
              setShowFullPicker(true);
              setShowPicker(false);
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150 border border-white/10 text-lg font-light"
          >
            +
          </button>
        </div>
      )}

      {/* Full emoji picker */}
      {showFullPicker && (
        <div
          className={`
          absolute z-[1000] bottom-full mb-2
          bg-[#13102a]/95 backdrop-blur-xl
          border border-white/[0.08]
          rounded-2xl p-3
          shadow-[0_16px_48px_rgba(0,0,0,0.7)]
          w-[280px]
          ${isMine ? "right-0" : "left-0"}
        `}
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
                  hover:bg-white/10 hover:scale-125
                  transition-all duration-150
                  ${myReaction === emoji ? "bg-violet-500/30 scale-110" : ""}
                `}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reaction display — message ke neeche */}
      {Object.keys(groupedReactions).length > 0 && (
        <div
          className={`
          flex items-center flex-wrap gap-1 mt-1
          ${isMine ? "justify-end" : "justify-start"}
        `}
        >
          {Object.entries(groupedReactions).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className={`
                flex items-center gap-1 px-2 py-0.5
                rounded-full text-xs
                border transition-all duration-150
                ${
                  myReaction === emoji
                    ? "bg-violet-500/30 border-violet-500/50 text-white"
                    : "bg-white/8 border-white/10 text-white/70 hover:bg-white/15"
                }
              `}
            >
              <span>{emoji}</span>
              {count > 1 && (
                <span className="text-[10px] font-medium">{count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiReaction;
