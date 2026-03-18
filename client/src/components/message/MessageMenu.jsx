// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Trash2, Trash, CheckSquare, Reply, Copy, Forward } from "lucide-react";

// const MessageMenu = ({
//   messageId,
//   isMine,
//   message,
//   onDelete,
//   onSelect,
//   onReply,
//   onForward,
//   onRegisterOpen,
//   children,
// }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });
//   const [copied, setCopied] = useState(false);
//   const [swipeX, setSwipeX] = useState(0);
//   const [isSwiping, setIsSwiping] = useState(false);

//   const menuRef = useRef(null);
//   const touchRef = useRef(null);
//   const longPressTimer = useRef(null);
//   const longPressTriggered = useRef(false);
//   const swipeTriggered = useRef(false);
//   const touchStartPos = useRef({ x: 0, y: 0 });
//   const isMoving = useRef(false);

//   const SWIPE_THRESHOLD = 55;
//   const SWIPE_MAX = 75;

//   const openMenu = useCallback(
//     (clientX, clientY) => {
//       const menuWidth = 220;
//       const menuHeight = 300;
//       const padding = 12;

//       let top = clientY - menuHeight - padding;
//       let left = isMine ? clientX - menuWidth : clientX;

//       if (top < padding) top = clientY + padding;
//       if (top + menuHeight > window.innerHeight - padding)
//         top = window.innerHeight - menuHeight - padding;
//       if (left < padding) left = padding;
//       if (left + menuWidth > window.innerWidth - padding)
//         left = window.innerWidth - menuWidth - padding;

//       setPosition({ top, left });
//       setMenuOpen(true);
//     },
//     [isMine],
//   );

//   useEffect(() => {
//     onRegisterOpen?.(openMenu);
//   }, [openMenu, onRegisterOpen]);

//   useEffect(() => {
//     if (!menuOpen) return;
//     const handler = (e) => {
//       if (menuRef.current?.contains(e.target)) return;
//       setMenuOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     document.addEventListener("touchend", handler);
//     return () => {
//       document.removeEventListener("mousedown", handler);
//       document.removeEventListener("touchend", handler);
//     };
//   }, [menuOpen]);

//   // ── Touch handlers ──
//   const handleTouchStart = useCallback(
//     (e) => {
//       const touch = e.touches[0];
//       touchStartPos.current = { x: touch.clientX, y: touch.clientY };
//       isMoving.current = false;
//       longPressTriggered.current = false;
//       swipeTriggered.current = false;
//       setIsSwiping(false);
//       setSwipeX(0);

//       longPressTimer.current = setTimeout(() => {
//         if (!isMoving.current) {
//           longPressTriggered.current = true;
//           if (navigator.vibrate) navigator.vibrate(50);
//           openMenu(touch.clientX, touch.clientY);
//         }
//       }, 500);
//     },
//     [openMenu],
//   );

//   const handleTouchMove = useCallback(
//     (e) => {
//       const touch = e.touches[0];
//       const dx = touch.clientX - touchStartPos.current.x;
//       const dy = Math.abs(touch.clientY - touchStartPos.current.y);
//       const absDx = Math.abs(dx);

//       if (dy > 10) {
//         clearTimeout(longPressTimer.current);
//         isMoving.current = true;
//         setSwipeX(0);
//         setIsSwiping(false);
//         return;
//       }

//       if (absDx > 5) {
//         clearTimeout(longPressTimer.current);
//         isMoving.current = true;
//       }

//       const validSwipe = (!isMine && dx > 0) || (isMine && dx < 0);
//       if (!validSwipe) return;

//       setIsSwiping(true);
//       const resistedX =
//         absDx < SWIPE_THRESHOLD
//           ? absDx
//           : SWIPE_THRESHOLD + (absDx - SWIPE_THRESHOLD) * 0.3;

//       setSwipeX(
//         isMine
//           ? -Math.min(resistedX, SWIPE_MAX)
//           : Math.min(resistedX, SWIPE_MAX),
//       );

//       if (absDx >= SWIPE_THRESHOLD && !swipeTriggered.current) {
//         swipeTriggered.current = true;
//         if (navigator.vibrate) navigator.vibrate(30);
//       }
//     },
//     [isMine],
//   );

//   const handleTouchEnd = useCallback(
//     (e) => {
//       clearTimeout(longPressTimer.current);

//       if (longPressTriggered.current) {
//         e.preventDefault();
//         longPressTriggered.current = false;
//       } else if (swipeTriggered.current && isSwiping) {
//         onReply?.(message);
//         setTimeout(() => {
//           document.querySelector('input[placeholder="Message..."]')?.focus();
//         }, 150);
//       }

//       setSwipeX(0);
//       setIsSwiping(false);
//       swipeTriggered.current = false;
//       isMoving.current = false;
//     },
//     [isSwiping, message, onReply],
//   );

//   // ── Manual listeners — passive fix ──
//   useEffect(() => {
//     const el = touchRef.current;
//     if (!el) return;

//     el.addEventListener("touchstart", handleTouchStart, { passive: true });
//     el.addEventListener("touchmove", handleTouchMove, { passive: true });
//     el.addEventListener("touchend", handleTouchEnd, { passive: false });

//     return () => {
//       el.removeEventListener("touchstart", handleTouchStart);
//       el.removeEventListener("touchmove", handleTouchMove);
//       el.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

//   const handleCopy = async () => {
//     if (!message?.text) return;
//     try {
//       await navigator.clipboard.writeText(message.text);
//     } catch {
//       const el = document.createElement("textarea");
//       el.value = message.text;
//       document.body.appendChild(el);
//       el.select();
//       document.execCommand("copy");
//       document.body.removeChild(el);
//     }
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//     setMenuOpen(false);
//   };

//   const focusInput = () => {
//     setTimeout(() => {
//       document.querySelector('input[placeholder="Message..."]')?.focus();
//     }, 150);
//   };

//   const menuItems = [
//     {
//       icon: <Reply className="w-4 h-4 shrink-0" />,
//       label: "Reply",
//       sublabel: "Reply to this message",
//       color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
//       onClick: () => {
//         onReply?.(message);
//         setMenuOpen(false);
//         focusInput();
//       },
//       show: true,
//     },
//     {
//       icon: <Copy className="w-4 h-4 shrink-0" />,
//       label: copied ? "Copied!" : "Copy",
//       sublabel: "Copy message text",
//       color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
//       onClick: handleCopy,
//       show: !!message?.text,
//     },
//     {
//       icon: <Forward className="w-4 h-4 shrink-0" />,
//       label: "Forward",
//       sublabel: "Forward to someone",
//       color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
//       onClick: () => {
//         onForward?.(message);
//         setMenuOpen(false);
//       },
//       show: true,
//     },
//     {
//       icon: <CheckSquare className="w-4 h-4 shrink-0" />,
//       label: "Select",
//       sublabel: "Select this message",
//       color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
//       onClick: () => {
//         onSelect?.(messageId);
//         setMenuOpen(false);
//       },
//       show: true,
//       dividerBefore: true,
//     },
//     {
//       icon: <Trash className="w-4 h-4 shrink-0" />,
//       label: "Delete for me",
//       sublabel: "Only you",
//       color: "text-white/70 hover:text-white hover:bg-white/[0.05]",
//       onClick: () => {
//         onDelete?.(messageId, "forMe");
//         setMenuOpen(false);
//       },
//       show: true,
//     },
//     {
//       icon: <Trash2 className="w-4 h-4 shrink-0" />,
//       label: "Delete for everyone",
//       sublabel: "Remove for all",
//       color: "text-red-400 hover:text-red-300 hover:bg-red-500/[0.06]",
//       onClick: () => {
//         onDelete?.(messageId, "forEveryone");
//         setMenuOpen(false);
//       },
//       show: isMine,
//     },
//   ].filter((item) => item.show);

//   const swipeProgress = Math.min(Math.abs(swipeX) / SWIPE_THRESHOLD, 1);

//   return (
//     <>
//       <div className="relative w-full">
//         {/* Reply icon — swipe pe reveal */}
//         <div
//           className={`absolute top-1/2 z-0 pointer-events-none
//             flex items-center justify-center w-8 h-8
//             ${isMine ? "right-1" : "left-1"}`}
//           style={{
//             opacity: swipeProgress,
//             transform: `translateY(-50%) scale(${0.5 + swipeProgress * 0.5})`,
//             color: swipeTriggered.current ? "#a78bfa" : "rgba(255,255,255,0.5)",
//           }}
//         >
//           <Reply className="w-5 h-5" />
//         </div>

//         {/* Message — touch events yahan attach hote hain */}
//         <div
//           ref={touchRef}
//           className="relative z-10 w-full"
//           style={{
//             transform: `translateX(${swipeX}px)`,
//             transition: isSwiping
//               ? "none"
//               : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
//             WebkitUserSelect: "none",
//             userSelect: "none",
//             WebkitTouchCallout: "none",
//           }}
//         >
//           {children}
//         </div>
//       </div>

//       {menuOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-[999]"
//             onClick={() => setMenuOpen(false)}
//           />
//           <div
//             ref={menuRef}
//             style={{ top: position.top, left: position.left }}
//             className="fixed z-[1000] w-[220px]
//               bg-[#13102a]/97 backdrop-blur-2xl
//               border border-white/[0.08]
//               rounded-2xl overflow-hidden
//               shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
//           >
//             {menuItems.map((item, index) => (
//               <div key={index}>
//                 {item.dividerBefore && (
//                   <div className="mx-4 border-t border-white/[0.06]" />
//                 )}
//                 <button
//                   onClick={item.onClick}
//                   className={`w-full flex items-center gap-3 px-4 py-3
//                     transition-colors duration-150 text-left ${item.color}`}
//                 >
//                   {item.icon}
//                   <div className="min-w-0">
//                     <p className="text-sm font-medium leading-tight">
//                       {item.label}
//                     </p>
//                     <p className="text-[10px] opacity-40 mt-0.5">
//                       {item.sublabel}
//                     </p>
//                   </div>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default MessageMenu;

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
  onRegisterOpen,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [copied, setCopied] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  const menuRef = useRef(null);
  const touchRef = useRef(null);
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  const swipeTriggered = useRef(false);
  const isSwipingRef = useRef(false); // ← ref use karo, state nahi
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);

  const SWIPE_THRESHOLD = 55;
  const SWIPE_MAX = 75;

  const openMenu = useCallback(
    (clientX, clientY) => {
      const menuWidth = 220;
      const menuHeight = 300;
      const padding = 12;

      let top = clientY - menuHeight - padding;
      let left = isMine ? clientX - menuWidth : clientX;

      if (top < padding) top = clientY + padding;
      if (top + menuHeight > window.innerHeight - padding)
        top = window.innerHeight - menuHeight - padding;
      if (left < padding) left = padding;
      if (left + menuWidth > window.innerWidth - padding)
        left = window.innerWidth - menuWidth - padding;

      setPosition({ top, left });
      setMenuOpen(true);
    },
    [isMine],
  );

  useEffect(() => {
    onRegisterOpen?.(openMenu);
  }, [openMenu, onRegisterOpen]);

  // ── Outside click — delay se add karo taaki long press release conflict na ho ──
  useEffect(() => {
    if (!menuOpen) return;

    const handler = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };

    // 300ms delay — long press finger uthane ke baad menu band na ho
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler, { passive: true });
    }, 300);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuOpen]);

  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      isMoving.current = false;
      longPressTriggered.current = false;
      swipeTriggered.current = false;
      isSwipingRef.current = false;
      setSwipeX(0);

      longPressTimer.current = setTimeout(() => {
        if (!isMoving.current) {
          longPressTriggered.current = true;
          if (navigator.vibrate) navigator.vibrate(50);
          openMenu(touch.clientX, touch.clientY);
        }
      }, 500);
    },
    [openMenu],
  );

  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = Math.abs(touch.clientY - touchStartPos.current.y);
      const absDx = Math.abs(dx);

      // Vertical — cancel sab
      if (dy > 10) {
        clearTimeout(longPressTimer.current);
        isMoving.current = true;
        isSwipingRef.current = false;
        setSwipeX(0);
        return;
      }

      if (absDx > 5) {
        clearTimeout(longPressTimer.current);
        isMoving.current = true;
      }

      const validSwipe = (!isMine && dx > 0) || (isMine && dx < 0);
      if (!validSwipe) return;

      isSwipingRef.current = true;

      const resistedX =
        absDx < SWIPE_THRESHOLD
          ? absDx
          : SWIPE_THRESHOLD + (absDx - SWIPE_THRESHOLD) * 0.3;

      setSwipeX(
        isMine
          ? -Math.min(resistedX, SWIPE_MAX)
          : Math.min(resistedX, SWIPE_MAX),
      );

      if (absDx >= SWIPE_THRESHOLD && !swipeTriggered.current) {
        swipeTriggered.current = true;
        if (navigator.vibrate) navigator.vibrate(30);
      }
    },
    [isMine],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      clearTimeout(longPressTimer.current);

      if (longPressTriggered.current) {
        // Long press — menu already open hai, bas flag reset karo
        e.preventDefault();
        e.stopPropagation();
        longPressTriggered.current = false;
      } else if (swipeTriggered.current && isSwipingRef.current) {
        // Swipe complete — reply trigger
        onReply?.(message);
        setTimeout(() => {
          document.querySelector('input[placeholder="Message..."]')?.focus();
        }, 150);
      }

      setSwipeX(0);
      isSwipingRef.current = false;
      swipeTriggered.current = false;
      isMoving.current = false;
    },
    [message, onReply],
  ); // isSwiping dependency hata di — ref use kar rahe hain

  useEffect(() => {
    const el = touchRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

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

  const focusInput = () => {
    setTimeout(() => {
      document.querySelector('input[placeholder="Message..."]')?.focus();
    }, 150);
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
        focusInput();
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

  const swipeProgress = Math.min(Math.abs(swipeX) / SWIPE_THRESHOLD, 1);

  return (
    <>
      <div className="relative w-full">
        {/* Reply icon */}
        <div
          className={`absolute top-1/2 z-0 pointer-events-none
            flex items-center justify-center w-8 h-8
            ${isMine ? "right-1" : "left-1"}`}
          style={{
            opacity: swipeProgress,
            transform: `translateY(-50%) scale(${0.5 + swipeProgress * 0.5})`,
            color: swipeTriggered.current ? "#a78bfa" : "rgba(255,255,255,0.5)",
          }}
        >
          <Reply className="w-5 h-5" />
        </div>

        {/* Message */}
        <div
          ref={touchRef}
          className="relative z-10 w-full"
          style={{
            transform: `translateX(${swipeX}px)`,
            transition: isSwipingRef.current
              ? "none"
              : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          {children}
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-[1000] w-[220px]
              bg-[#13102a]/97 backdrop-blur-2xl
              border border-white/[0.08]
              rounded-2xl overflow-hidden
              shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.dividerBefore && (
                  <div className="mx-4 border-t border-white/[0.06]" />
                )}
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3
                    transition-colors duration-150 text-left ${item.color}`}
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