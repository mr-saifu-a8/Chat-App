// import React, {
//   useContext,
//   useEffect,
//   useRef,
//   useImperativeHandle,
//   forwardRef,
// } from "react";
// import { ChatContext } from "../../context/ChatContext";
// import { AuthContext } from "../../context/AuthContext";
// import MessageBubble from "./MessageBubble";

// const MessageList = forwardRef(
//   ({ onReply, isSelecting, selectedIds, onSelect }, ref) => {
//     const { messages, isTyping } = useContext(ChatContext);
//     const { authUser } = useContext(AuthContext);
//     const scrollEnd = useRef();
//     const containerRef = useRef();
//     const isFirstLoad = useRef(true);

//     // Parent se scrollToBottom call kar sake
//     useImperativeHandle(ref, () => ({
//       scrollToBottom: () => {
//         scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
//       },
//     }));

//     // Sirf pehli baar — conversation open hone pe instant scroll
//     useEffect(() => {
//       if (messages.length === 0) return;
//       if (isFirstLoad.current) {
//         setTimeout(() => {
//           scrollEnd.current?.scrollIntoView({ behavior: "instant" });
//         }, 50);
//         isFirstLoad.current = false;
//       }
//     }, [messages]);

//     // Dusre ka message aaya — sirf tab scroll karo jab bottom pe ho
//     useEffect(() => {
//       if (messages.length === 0) return;
//       if (isFirstLoad.current) return;

//       const lastMsg = messages[messages.length - 1];
//       const isMyMessage =
//         lastMsg?.senderId?.toString() === authUser?._id?.toString();

//       // Apna message — ChatContainer handle karega via ref
//       if (isMyMessage) return;

//       // Dusre ka message — sirf near bottom pe ho toh scroll
//       const container = containerRef.current;
//       if (container) {
//         const { scrollTop, scrollHeight, clientHeight } = container;
//         const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
//         if (isNearBottom) {
//           scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
//         }
//       }
//     }, [messages]);

//     // selectedUser change — reset
//     useEffect(() => {
//       isFirstLoad.current = true;
//     }, []);

//     const getDateLabel = (dateStr) => {
//       const date = new Date(dateStr);
//       const today = new Date();
//       const yesterday = new Date();
//       yesterday.setDate(today.getDate() - 1);
//       if (date.toDateString() === today.toDateString()) return "Today";
//       if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
//       return date.toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       });
//     };

//     const groupedMessages = messages.reduce((acc, msg) => {
//       const label = getDateLabel(msg.createdAt);
//       if (!acc[label]) acc[label] = [];
//       acc[label].push(msg);
//       return acc;
//     }, {});

//     return (
//       <div
//         ref={containerRef}
//         className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
//       >
//         {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
//           <div key={dateLabel}>
//             <div className="flex items-center gap-3 my-4 px-4">
//               <div className="flex-1 h-px bg-white/[0.06]" />
//               <span className="text-[10px] text-white/25 font-medium px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
//                 {dateLabel}
//               </span>
//               <div className="flex-1 h-px bg-white/[0.06]" />
//             </div>

//             <div className="space-y-0.5">
//               {msgs.map((msg, index) => {
//                 const prevMsg = msgs[index - 1];
//                 const nextMsg = msgs[index + 1];
//                 const isFirst =
//                   !prevMsg ||
//                   prevMsg.senderId?.toString() !== msg.senderId?.toString();
//                 const isLast =
//                   !nextMsg ||
//                   nextMsg.senderId?.toString() !== msg.senderId?.toString();
//                 return (
//                   <MessageBubble
//                     key={msg._id || index}
//                     msg={msg}
//                     isFirst={isFirst}
//                     isLast={isLast}
//                     onReply={onReply}
//                     isSelecting={isSelecting}
//                     isSelected={selectedIds.has(msg._id)}
//                     onSelect={onSelect}
//                   />
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex justify-start px-4 mt-2 mb-3">
//             <div className="bg-white/[0.09] rounded-2xl rounded-bl-sm px-4 py-3">
//               <div className="flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:0ms]" />
//                 <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:150ms]" />
//                 <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:300ms]" />
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={scrollEnd} className="h-4" />
//       </div>
//     );
//   },
// );

// MessageList.displayName = "MessageList";
// export default MessageList;

import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";

const MessageList = React.forwardRef(
  ({ onReply, isSelecting, selectedIds, onSelect }, ref) => {
    const { messages, isTyping } = useContext(ChatContext);
    const { authUser } = useContext(AuthContext);
    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    const isFirstLoad = useRef(true);
    const lastMessageCount = useRef(0);
    const lastMessageId = useRef(null);

    // Scroll function expose karo parent ke liye
    React.useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    }));

    useEffect(() => {
      if (messages.length === 0) return;

      const lastMsg = messages[messages.length - 1];

      // Case 1: Pehli baar load — instant scroll, no animation
      if (isFirstLoad.current) {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
        isFirstLoad.current = false;
        lastMessageCount.current = messages.length;
        lastMessageId.current = lastMsg._id;
        return;
      }

      // Case 2: Koi naya message nahi aaya — kuch mat karo
      if (messages.length === lastMessageCount.current) return;
      if (lastMsg._id === lastMessageId.current) return;

      // Case 3: Naya message aaya
      const isMyMessage =
        lastMsg?.senderId?.toString() === authUser?._id?.toString();

      if (isMyMessage) {
        // Mera message — ChatContainer handle karega (onMessageSent se)
        // Yahan kuch nahi karna
      } else {
        // Dusre ka message — sirf near bottom pe ho toh scroll
        const container = containerRef.current;
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
          if (distanceFromBottom < 150) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }

      lastMessageCount.current = messages.length;
      lastMessageId.current = lastMsg._id;
    }, [messages, authUser]);

    // selectedUser change hone pe reset
    useEffect(() => {
      isFirstLoad.current = true;
      lastMessageCount.current = 0;
      lastMessageId.current = null;
    }, []);

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
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-3 my-4 px-4">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] text-white/25 font-medium px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                {dateLabel}
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="space-y-0.5">
              {msgs.map((msg, index) => {
                const prevMsg = msgs[index - 1];
                const nextMsg = msgs[index + 1];
                const isFirst =
                  !prevMsg ||
                  prevMsg.senderId?.toString() !== msg.senderId?.toString();
                const isLast =
                  !nextMsg ||
                  nextMsg.senderId?.toString() !== msg.senderId?.toString();
                return (
                  <MessageBubble
                    key={msg._id || index}
                    msg={msg}
                    isFirst={isFirst}
                    isLast={isLast}
                    onReply={onReply}
                    isSelecting={isSelecting}
                    isSelected={selectedIds.has(msg._id)}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          </div>
        ))}

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

        <div ref={bottomRef} className="h-2" />
      </div>
    );
  },
);

MessageList.displayName = "MessageList";
export default MessageList;