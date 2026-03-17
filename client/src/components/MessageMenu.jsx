import React, { useState, useRef, useEffect, useCallback } from "react";
import { Trash2, Trash, CheckSquare, Reply, Copy, Forward } from "lucide-react";

const MessageMenu = ({
  messageId,
  isMine,
  message,
  onDelete,
  onSelect,
  onReply,
  onForward,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [copied, setCopied] = useState(false);

  // Swipe state
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeTriggered = useRef(false);

  const menuRef = useRef(null);
  const wrapperRef = useRef(null);
  const dotBtnRef = useRef(null);
  const touchRef = useRef(null);

  // Long press state
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchStartTime = useRef(0);

  const SWIPE_THRESHOLD = 60; // kitna swipe karo reply trigger ke liye
  const SWIPE_MAX = 80; // max kitna swipe ho sakta hai
  const LONG_PRESS_DURATION = 500;

  // ── Menu position ──
  const openMenu = useCallback(
    (clientX, clientY) => {
      const menuWidth = 220;
      const menuHeight = 300;
      const padding = 12;

      let top = clientY - menuHeight - padding;
      let left = isMine ? clientX - menuWidth : clientX;

      if (top < padding) top = clientY + padding;
      if (top + menuHeight > window.innerHeight - padding) {
        top = window.innerHeight - menuHeight - padding;
      }
      if (left < padding) left = padding;
      if (left + menuWidth > window.innerWidth - padding) {
        left = window.innerWidth - menuWidth - padding;
      }

      setPosition({ top, left });
      setMenuOpen(true);
    },
    [isMine],
  );

  // ── Outside click close ──
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (
        menuRef.current?.contains(e.target) ||
        dotBtnRef.current?.contains(e.target)
      )
        return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  // ── Touch handlers ──
  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      touchStartTime.current = Date.now();
      longPressTriggered.current = false;
      swipeTriggered.current = false;
      setIsSwiping(false);
      setSwipeX(0);

      // Long press timer shuru karo
      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        if (navigator.vibrate) navigator.vibrate(40);
        openMenu(touch.clientX, touch.clientY);
      }, LONG_PRESS_DURATION);
    },
    [openMenu],
  );

  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = Math.abs(touch.clientY - touchStartPos.current.y);

      // Vertical scroll ho raha hai — long press cancel, swipe nahi
      if (dy > 15) {
        clearTimeout(longPressTimer.current);
        return;
      }

      // Horizontal swipe detect karo
      const isRightSwipe = !isMine && dx > 0; // dusre ka message — right swipe
      const isLeftSwipe = isMine && dx < 0; // mera message — left swipe

      if (isRightSwipe || isLeftSwipe) {
        // Long press cancel karo kyunki swipe ho raha hai
        clearTimeout(longPressTimer.current);
        setIsSwiping(true);

        // Swipe amount clamp karo
        const absDx = Math.abs(dx);
        const clampedX = Math.min(absDx, SWIPE_MAX);

        // Resistance add karo — threshold ke baad slow ho
        const resistedX =
          clampedX < SWIPE_THRESHOLD
            ? clampedX
            : SWIPE_THRESHOLD + (clampedX - SWIPE_THRESHOLD) * 0.3;

        setSwipeX(isMine ? -resistedX : resistedX);

        // Threshold cross kiya — reply trigger hoga release pe
        if (absDx >= SWIPE_THRESHOLD && !swipeTriggered.current) {
          swipeTriggered.current = true;
          if (navigator.vibrate) navigator.vibrate(30);
        }
      } else {
        // Horizontal move but wrong direction — long press cancel
        if (Math.abs(dx) > 10) {
          clearTimeout(longPressTimer.current);
        }
      }
    },
    [isMine],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      clearTimeout(longPressTimer.current);

      if (longPressTriggered.current) {
        e.preventDefault();
        e.stopPropagation();
        longPressTriggered.current = false;
      }

      // Swipe complete — reply trigger karo
      if (swipeTriggered.current && isSwiping) {
        onReply?.(message);
      }

      // Swipe reset — smooth animation ke saath
      setSwipeX(0);
      setIsSwiping(false);
      swipeTriggered.current = false;
    },
    [isSwiping, message, onReply],
  );

  // ── Manual event listeners ──
  useEffect(() => {
    const el = touchRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  // ── Desktop dot button ──
  const handleDotClick = useCallback(
    (e) => {
      e.stopPropagation();
      const rect = dotBtnRef.current?.getBoundingClientRect();
      if (rect) openMenu(rect.left, rect.bottom);
    },
    [openMenu],
  );

  // ── Copy ──
  const handleCopy = async () => {
    if (!message?.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
    } catch {
      const el = document.createElement("textarea");
      el.value = message.text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  const menuItems = [
    {
      icon: <Reply className="w-4 h-4 shrink-0" />,
      label: "Reply",
      sublabel: "Reply to this message",
      color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
      onClick: () => {
        onReply?.(message);
        setMenuOpen(false);
      },
      show: true,
    },
    {
      icon: <Copy className="w-4 h-4 shrink-0" />,
      label: copied ? "Copied!" : "Copy",
      sublabel: "Copy message text",
      color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
      onClick: handleCopy,
      show: !!message?.text,
    },
    {
      icon: <Forward className="w-4 h-4 shrink-0" />,
      label: "Forward",
      sublabel: "Forward to someone",
      color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
      onClick: () => {
        onForward?.(message);
        setMenuOpen(false);
      },
      show: true,
    },
    {
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
      label: "Select",
      sublabel: "Select this message",
      color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
      onClick: () => {
        onSelect?.(messageId);
        setMenuOpen(false);
      },
      show: true,
      dividerBefore: true,
    },
    {
      icon: <Trash className="w-4 h-4 shrink-0" />,
      label: "Delete for me",
      sublabel: "Only you",
      color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
      onClick: () => {
        onDelete?.(messageId, "forMe");
        setMenuOpen(false);
      },
      show: true,
    },
    {
      icon: <Trash2 className="w-4 h-4 shrink-0" />,
      label: "Delete for everyone",
      sublabel: "Remove for all",
      color: "text-red-400 hover:text-red-300 hover:bg-red-500/[0.06]",
      onClick: () => {
        onDelete?.(messageId, "forEveryone");
        setMenuOpen(false);
      },
      show: isMine,
    },
  ].filter((item) => item.show);

  // Swipe progress — reply icon opacity ke liye
  const swipeProgress = Math.min(Math.abs(swipeX) / SWIPE_THRESHOLD, 1);
  const replyTriggered = swipeTriggered.current;

  return (
    <>
      <div ref={wrapperRef} className="relative w-full overflow-hidden">
        {/* ── Reply icon — swipe pe reveal hota hai ── */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 z-0
            flex items-center justify-center
            w-8 h-8 rounded-full
            transition-all duration-150
            ${isMine ? "right-1" : "left-1"}
          `}
          style={{
            opacity: swipeProgress,
            transform: `translateY(-50%) scale(${0.6 + swipeProgress * 0.4})`,
            color: replyTriggered ? "#a78bfa" : "rgba(255,255,255,0.5)",
          }}
        >
          <Reply className="w-5 h-5" />
        </div>

        {/* ── Message — swipe transform ── */}
        <div
          ref={touchRef}
          className="relative z-10 w-full"
          style={{
            transform: `translateX(${swipeX}px)`,
            transition: isSwiping
              ? "none"
              : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          {children}
        </div>

        {/* ── Desktop dot button ── */}
        <button
          ref={dotBtnRef}
          onClick={handleDotClick}
          aria-label="Message options"
          className={`
            absolute top-1
            ${isMine ? "-left-7" : "-right-7"}
            w-6 h-6 rounded-lg z-20
            items-center justify-center
            opacity-0 group-hover:opacity-100
            hover:bg-white/10 active:scale-90
            transition-all duration-150
            md:flex hidden
            ${menuOpen ? "!opacity-100 bg-white/10" : ""}
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

      {/* ── Dropdown menu ── */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            className="
              fixed z-[1000] w-[220px]
              bg-[#13102a]/97 backdrop-blur-2xl
              border border-white/[0.08]
              rounded-2xl overflow-hidden
              shadow-[0_20px_60px_rgba(0,0,0,0.8)]
            "
          >
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.dividerBefore && (
                  <div className="mx-4 border-t border-white/[0.06]" />
                )}
                <button
                  onClick={item.onClick}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    transition-colors duration-150 text-left
                    ${item.color}
                  `}
                >
                  {item.icon}
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {item.label}
                    </p>
                    <p className="text-[10px] opacity-40 mt-0.5">
                      {item.sublabel}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MessageMenu;