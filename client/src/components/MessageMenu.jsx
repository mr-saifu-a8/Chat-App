import React, { useState, useRef, useEffect, useCallback } from "react";
import { Trash2, Trash, CheckSquare } from "lucide-react";

const MessageMenu = ({ messageId, isMine, onDelete, onSelect, children }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const wrapperRef = useRef(null);
  const dotBtnRef = useRef(null);
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  const openMenu = useCallback(
    (clientX, clientY) => {
      const menuWidth = 220;
      const menuHeight = isMine ? 160 : 120;

      let top = clientY - menuHeight - 8;
      let left = isMine ? clientX - menuWidth : clientX;

      if (top < 8) top = clientY + 8;
      if (left < 8) left = 8;
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }

      setPosition({ top, left });
      setOpen(true);
    },
    [isMine],
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current?.contains(e.target) ||
        wrapperRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  // Long press handlers
  const handleTouchStart = (e) => {
    longPressTriggered.current = false;
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      if (navigator.vibrate) navigator.vibrate(50);
      openMenu(touch.clientX, touch.clientY);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleTouchMove = () => {
    clearTimeout(longPressTimer.current);
  };

  // 3 dot button click
  const handleDotClick = (e) => {
    e.stopPropagation();
    const rect = dotBtnRef.current?.getBoundingClientRect();
    if (rect) openMenu(rect.right, rect.top);
  };

  return (
    <div
      ref={wrapperRef}
      className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* 3 dot button — desktop hover pe */}
      <div className="shrink-0 mb-5 flex items-center">
        <button
          ref={dotBtnRef}
          onClick={handleDotClick}
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

      {/* Message bubble — long press yahan */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="min-w-0"
      >
        {children}
      </div>

      {/* Fixed dropdown menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setOpen(false)}
          />
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
            {/* Select */}
            <button
              onClick={() => {
                onSelect?.(messageId);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors duration-150"
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">Select</p>
                <p className="text-[10px] text-white/30 mt-0.5">
                  Select this message
                </p>
              </div>
            </button>

            <div className="mx-4 border-t border-white/[0.06]" />

            {/* Delete for me */}
            <button
              onClick={() => {
                onDelete(messageId, "forMe");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors duration-150"
            >
              <Trash className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">
                  Delete for me
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">Only you</p>
              </div>
            </button>

            {isMine && (
              <>
                <div className="mx-4 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    onDelete(messageId, "forEveryone");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors duration-150"
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
    </div>
  );
};

export default MessageMenu;