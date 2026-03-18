// import React, { useContext, useEffect, useRef } from "react";
// import { ChatContext } from "../../context/ChatContext";
// import MessageBubble from "./MessageBubble";

// const MessageList = ({ onReply }) => {
//   const { messages, isTyping } = useContext(ChatContext);
//   const scrollEnd = useRef();

//   useEffect(() => {
//     scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const getDateLabel = (dateStr) => {
//     const date = new Date(dateStr);
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);
//     if (date.toDateString() === today.toDateString()) return "Today";
//     if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
//     return date.toLocaleDateString("en-US", {
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const groupedMessages = messages.reduce((acc, msg) => {
//     const label = getDateLabel(msg.createdAt);
//     if (!acc[label]) acc[label] = [];
//     acc[label].push(msg);
//     return acc;
//   }, {});

//   return (
//     // overflow-x-hidden HATA DIYA — swipe aur dot button clip ho rahe the
//     <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
//       {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
//         <div key={dateLabel}>
//           <div className="flex items-center gap-3 my-4 px-4">
//             <div className="flex-1 h-px bg-white/[0.06]" />
//             <span className="text-[10px] text-white/25 font-medium px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
//               {dateLabel}
//             </span>
//             <div className="flex-1 h-px bg-white/[0.06]" />
//           </div>

//           <div className="space-y-0.5">
//             {msgs.map((msg, index) => {
//               const prevMsg = msgs[index - 1];
//               const nextMsg = msgs[index + 1];
//               const isFirst =
//                 !prevMsg ||
//                 prevMsg.senderId?.toString() !== msg.senderId?.toString();
//               const isLast =
//                 !nextMsg ||
//                 nextMsg.senderId?.toString() !== msg.senderId?.toString();
//               return (
//                 <MessageBubble
//                   key={msg._id || index}
//                   msg={msg}
//                   isFirst={isFirst}
//                   isLast={isLast}
//                   onReply={onReply}
//                 />
//               );
//             })}
//           </div>
//         </div>
//       ))}

//       {isTyping && (
//         <div className="flex justify-start px-4 mt-2 mb-3">
//           <div className="bg-white/[0.09] rounded-2xl rounded-bl-sm px-4 py-3">
//             <div className="flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:0ms]" />
//               <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:150ms]" />
//               <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:300ms]" />
//             </div>
//           </div>
//         </div>
//       )}
//       <div ref={scrollEnd} />
//     </div>
//   );
// };

// export default MessageList;

import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import MessageBubble from "./MessageBubble";

const MessageList = ({ onReply, isSelecting, selectedIds, onSelect }) => {
  const { messages, isTyping } = useContext(ChatContext);
  const scrollEnd = useRef();

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
      <div ref={scrollEnd} />
    </div>
  );
};

export default MessageList;