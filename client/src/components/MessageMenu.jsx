import React, { useState, useRef, useEffect, useCallback } from "react";
import { Trash2, Trash, Copy, X } from "lucide-react";

const MessageMenu = ({ messageId, isMine, onDelete, messageText }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const longPressTimer = useRef(null);

  // Menu position calculate karo — screen ke bahar na jaaye
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = isMine ? 140 : 100;
    const menuWidth = 220;

    let top = rect.top - menuHeight - 8;
    let left = isMine ? rect.right - menuWidth : rect.left;

    // Screen ke bahar jaane se rokho
    if (top < 8) top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }

    setPosition({ top, left });
  }, [isMine]);

  // Click outside close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // 3 dot click
  const handleClick = (e) => {
    e.stopPropagation();
    calculatePosition();
    setOpen((p) => !p);
  };

  // Long press — mobile ke liye
  const handleTouchStart = (e) => {
    longPressTimer.current = setTimeout(() => {
      calculatePosition();
      setOpen(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Copy message text
  const handleCopy = () => {
    if (messageText) {
      navigator.clipboard.writeText(messageText);
    }
    setOpen(false);
  };

  return (
    <>
      {/* Trigger — 3 dot button + long press area */}
      <div
        ref={triggerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        className="flex items-center"
      >
        <button
          onClick={handleClick}
          className={`
            w-5 h-5 rounded-md flex items-center justify-center
            opacity-0 group-hover:opacity-100
            hover:bg-white/10 active:scale-90
            transition-all duration-150
            ${open ? "!opacity-100 bg-white/10" : ""}
          `}
        >
          <svg
            className="w-3 h-3 text-white/50"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Portal-style fixed menu — scroll ke saath nahi jaata */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setOpen(false)}
          />

          {/* Menu */}
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            className="
              fixed z-[1000] w-[220px]
              bg-[#13102a]/95 backdrop-blur-xl
              border border-white/[0.08]
              rounded-2xl overflow-hidden
              shadow-[0_16px_48px_rgba(0,0,0,0.7)]
            "
          >
            {/* Copy — sirf text messages pe */}
            {messageText && (
              <button
                onClick={handleCopy}
                className="
                  w-full flex items-center gap-3 px-4 py-3
                  text-white/70 hover:text-white
                  hover:bg-white/[0.05]
                  transition-colors duration-150
                "
              >
                <Copy className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Copy</span>
              </button>
            )}

            {/* Divider */}
            {messageText && (
              <div className="mx-4 border-t border-white/[0.06]" />
            )}

            {/* Delete for me */}
            <button
              onClick={() => {
                onDelete(messageId, "forMe");
                setOpen(false);
              }}
              className="
                w-full flex items-center gap-3 px-4 py-3
                text-white/70 hover:text-white
                hover:bg-white/[0.05]
                transition-colors duration-150
              "
            >
              <Trash className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">
                  Delete for me
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">Only you</p>
              </div>
            </button>

            {/* Delete for everyone — sirf sender */}
            {isMine && (
              <>
                <div className="mx-4 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    onDelete(messageId, "forEveryone");
                    setOpen(false);
                  }}
                  className="
                    w-full flex items-center gap-3 px-4 py-3
                    text-red-400 hover:text-red-300
                    hover:bg-red-500/[0.06]
                    transition-colors duration-150
                  "
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium leading-tight">
                      Delete for everyone
                    </p>
                    <p className="text-[10px] text-red-400/50 mt-0.5">
                      Remove for all
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MessageMenu;
