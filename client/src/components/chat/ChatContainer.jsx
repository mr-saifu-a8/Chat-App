// // // import React, {
// // //   useRef,
// // //   useState,
// // //   useContext,
// // //   useEffect,
// // //   useCallback,
// // // } from "react";
// // // import { ChatContext } from "../../context/ChatContext";
// // // import ChatHeader from "./ChatHeader";
// // // import MessageList from "./MessageList";
// // // import MessageInput from "./MessageInput";
// // // import ReplyPreview from "./ReplyPreview";
// // // import SelectionBar from "./SelectionBar";
// // // import assets from "../../assets/assets";
// // // import toast from "react-hot-toast";

// // // const ChatContainer = () => {
// // //   const { selectedUser, getMessages, deleteMessage } = useContext(ChatContext);
// // //   const typingTimeoutRef = useRef(null);
// // //   const [replyTo, setReplyTo] = useState(null);

// // //   // ── Selection state ──
// // //   const [isSelecting, setIsSelecting] = useState(false);
// // //   const [selectedIds, setSelectedIds] = useState(new Set());

// // //   useEffect(() => {
// // //     if (selectedUser?._id) {
// // //       getMessages(selectedUser._id);
// // //     }
// // //     setReplyTo(null);
// // //     // User change hone pe selection cancel karo
// // //     setIsSelecting(false);
// // //     setSelectedIds(new Set());
// // //   }, [selectedUser]);

// // //   // ── Select / deselect ek message ──
// // //   const handleSelect = useCallback(
// // //     (msgId, startSelecting = false) => {
// // //       if (startSelecting && !isSelecting) {
// // //         // MessageMenu se "Select" click — selection mode start karo
// // //         setIsSelecting(true);
// // //         setSelectedIds(new Set([msgId]));
// // //         return;
// // //       }

// // //       if (!isSelecting) return;

// // //       setSelectedIds((prev) => {
// // //         const next = new Set(prev);
// // //         if (next.has(msgId)) {
// // //           next.delete(msgId);
// // //           // Agar sab deselect ho gaye toh mode cancel
// // //           if (next.size === 0) setIsSelecting(false);
// // //         } else {
// // //           next.add(msgId);
// // //         }
// // //         return next;
// // //       });
// // //     },
// // //     [isSelecting],
// // //   );

// // //   // ── Delete selected messages ──
// // //   const handleDeleteSelected = useCallback(async () => {
// // //     if (selectedIds.size === 0) return;

// // //     const promises = Array.from(selectedIds).map((id) =>
// // //       deleteMessage(id, "forMe"),
// // //     );

// // //     await Promise.all(promises);
// // //     toast.success(
// // //       `${selectedIds.size} message${selectedIds.size > 1 ? "s" : ""} deleted`,
// // //     );
// // //     setSelectedIds(new Set());
// // //     setIsSelecting(false);
// // //   }, [selectedIds, deleteMessage]);

// // //   // ── Cancel selection ──
// // //   const handleCancelSelection = useCallback(() => {
// // //     setSelectedIds(new Set());
// // //     setIsSelecting(false);
// // //   }, []);

// // //   if (!selectedUser) {
// // //     return (
// // //       <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-4 bg-transparent">
// // //         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
// // //           <img
// // //             src={assets.logo_icon}
// // //             className="w-8 h-8 opacity-60"
// // //             alt="logo"
// // //           />
// // //         </div>
// // //         <div className="text-center">
// // //           <p className="text-base font-semibold text-white/70">
// // //             Select a conversation
// // //           </p>
// // //           <p className="text-sm text-white/30 mt-1">
// // //             Choose from your existing chats
// // //           </p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex-1 flex flex-col h-full min-w-0">
// // //       {/* Selection bar ya normal header */}
// // //       {isSelecting ? (
// // //         <SelectionBar
// // //           selectedCount={selectedIds.size}
// // //           onDelete={handleDeleteSelected}
// // //           onCancel={handleCancelSelection}
// // //         />
// // //       ) : (
// // //         <ChatHeader />
// // //       )}

// // //       <MessageList
// // //         onReply={(msg) => setReplyTo(msg)}
// // //         isSelecting={isSelecting}
// // //         selectedIds={selectedIds}
// // //         onSelect={handleSelect}
// // //       />

// // //       {/* Input — selection mode mein hide */}
// // //       {!isSelecting && (
// // //         <>
// // //           <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
// // //           <MessageInput
// // //             replyTo={replyTo}
// // //             onReplyCancel={() => setReplyTo(null)}
// // //             typingTimeoutRef={typingTimeoutRef}
// // //           />
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ChatContainer;

// // import React, {
// //   useRef,
// //   useState,
// //   useContext,
// //   useEffect,
// //   useCallback,
// // } from "react";
// // import { ChatContext } from "../../context/ChatContext";
// // import ChatHeader from "./ChatHeader";
// // import MessageList from "./MessageList";
// // import MessageInput from "./MessageInput";
// // import ReplyPreview from "./ReplyPreview";
// // import SelectionBar from "./SelectionBar";
// // import assets from "../../assets/assets";
// // import toast from "react-hot-toast";

// // const ChatContainer = () => {
// //   const { selectedUser, getMessages, bulkDeleteMessages } =
// //     useContext(ChatContext);
// //   const typingTimeoutRef = useRef(null);
// //   const [replyTo, setReplyTo] = useState(null);

// //   const [isSelecting, setIsSelecting] = useState(false);
// //   const [selectedIds, setSelectedIds] = useState(new Set());

// //   useEffect(() => {
// //     if (selectedUser?._id) {
// //       getMessages(selectedUser._id);
// //     }
// //     setReplyTo(null);
// //     setIsSelecting(false);
// //     setSelectedIds(new Set());
// //   }, [selectedUser]);

// //   const handleSelect = useCallback(
// //     (msgId, startSelecting = false) => {
// //       if (startSelecting && !isSelecting) {
// //         setIsSelecting(true);
// //         setSelectedIds(new Set([msgId]));
// //         return;
// //       }
// //       if (!isSelecting) return;
// //       setSelectedIds((prev) => {
// //         const next = new Set(prev);
// //         if (next.has(msgId)) {
// //           next.delete(msgId);
// //           if (next.size === 0) setIsSelecting(false);
// //         } else {
// //           next.add(msgId);
// //         }
// //         return next;
// //       });
// //     },
// //     [isSelecting],
// //   );

// //   const handleDeleteSelected = useCallback(async () => {
// //     if (selectedIds.size === 0) return;
// //     const ids = Array.from(selectedIds);

// //     // Ek API call mein sab delete — MongoDB + frontend update
// //     await bulkDeleteMessages(ids, "forMe");

// //     toast.success(`${ids.length} message${ids.length > 1 ? "s" : ""} deleted`);
// //     setSelectedIds(new Set());
// //     setIsSelecting(false);
// //   }, [selectedIds, bulkDeleteMessages]);

// //   const handleCancelSelection = useCallback(() => {
// //     setSelectedIds(new Set());
// //     setIsSelecting(false);
// //   }, []);

// //   if (!selectedUser) {
// //     return (
// //       <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-4 bg-transparent">
// //         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
// //           <img
// //             src={assets.logo_icon}
// //             className="w-8 h-8 opacity-60"
// //             alt="logo"
// //           />
// //         </div>
// //         <div className="text-center">
// //           <p className="text-base font-semibold text-white/70">
// //             Select a conversation
// //           </p>
// //           <p className="text-sm text-white/30 mt-1">
// //             Choose from your existing chats
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex-1 flex flex-col h-full min-w-0">
// //       {isSelecting ? (
// //         <SelectionBar
// //           selectedCount={selectedIds.size}
// //           onDelete={handleDeleteSelected}
// //           onCancel={handleCancelSelection}
// //         />
// //       ) : (
// //         <ChatHeader />
// //       )}

// //       <MessageList
// //         onReply={(msg) => setReplyTo(msg)}
// //         isSelecting={isSelecting}
// //         selectedIds={selectedIds}
// //         onSelect={handleSelect}
// //       />

// //       {!isSelecting && (
// //         <>
// //           <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
// //           <MessageInput
// //             replyTo={replyTo}
// //             onReplyCancel={() => setReplyTo(null)}
// //             typingTimeoutRef={typingTimeoutRef}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatContainer;

// import React, {
//   useRef,
//   useState,
//   useContext,
//   useEffect,
//   useCallback,
// } from "react";
// import { ChatContext } from "../../context/ChatContext";
// import ChatHeader from "./ChatHeader";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";
// import ReplyPreview from "./ReplyPreview";
// import SelectionBar from "./SelectionBar";
// import assets from "../../assets/assets";
// import toast from "react-hot-toast";

// const ChatContainer = () => {
//   const { selectedUser, getMessages, deleteMessage, deleteMessages } =
//     useContext(ChatContext);
//   const typingTimeoutRef = useRef(null);
//   const [replyTo, setReplyTo] = useState(null);
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectedIds, setSelectedIds] = useState(new Set());

//   useEffect(() => {
//     if (selectedUser?._id) {
//       getMessages(selectedUser._id);
//     }
//     setReplyTo(null);
//     setIsSelecting(false);
//     setSelectedIds(new Set());
//   }, [selectedUser]);

//   const handleSelect = useCallback(
//     (msgId, startSelecting = false) => {
//       if (startSelecting && !isSelecting) {
//         setIsSelecting(true);
//         setSelectedIds(new Set([msgId]));
//         return;
//       }
//       if (!isSelecting) return;
//       setSelectedIds((prev) => {
//         const next = new Set(prev);
//         if (next.has(msgId)) {
//           next.delete(msgId);
//           if (next.size === 0) setIsSelecting(false);
//         } else {
//           next.add(msgId);
//         }
//         return next;
//       });
//     },
//     [isSelecting],
//   );

//   const handleDeleteSelected = useCallback(async () => {
//     if (selectedIds.size === 0) return;
//     const ids = Array.from(selectedIds);

//     if (deleteMessages) {
//       // Bulk delete — ek API call
//       await deleteMessages(ids, "forMe");
//     } else {
//       // Fallback — individual delete
//       await Promise.all(ids.map((id) => deleteMessage(id, "forMe")));
//     }

//     toast.success(`${ids.length} message${ids.length > 1 ? "s" : ""} deleted`);
//     setSelectedIds(new Set());
//     setIsSelecting(false);
//   }, [selectedIds, deleteMessage, deleteMessages]);

//   const handleCancelSelection = useCallback(() => {
//     setSelectedIds(new Set());
//     setIsSelecting(false);
//   }, []);

//   if (!selectedUser) {
//     return (
//       <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-4 bg-transparent">
//         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
//           <img
//             src={assets.logo_icon}
//             className="w-8 h-8 opacity-60"
//             alt="logo"
//           />
//         </div>
//         <div className="text-center">
//           <p className="text-base font-semibold text-white/70">
//             Select a conversation
//           </p>
//           <p className="text-sm text-white/30 mt-1">
//             Choose from your existing chats
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col h-full min-w-0">
//       {isSelecting ? (
//         <SelectionBar
//           selectedCount={selectedIds.size}
//           onDelete={handleDeleteSelected}
//           onCancel={handleCancelSelection}
//         />
//       ) : (
//         <ChatHeader />
//       )}

//       <MessageList
//         onReply={(msg) => setReplyTo(msg)}
//         isSelecting={isSelecting}
//         selectedIds={selectedIds}
//         onSelect={handleSelect}
//       />

//       {!isSelecting && (
//         <>
//           <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
//           <MessageInput
//             replyTo={replyTo}
//             onReplyCancel={() => setReplyTo(null)}
//             typingTimeoutRef={typingTimeoutRef}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default ChatContainer;

import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { ChatContext } from "../../context/ChatContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ReplyPreview from "./ReplyPreview";
import SelectionBar from "./SelectionBar";
import assets from "../../assets/assets";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { selectedUser, getMessages, deleteMessage, deleteMessages } =
    useContext(ChatContext);
  const typingTimeoutRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const messageListRef = useRef(null); // ← MessageList ka ref

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    setReplyTo(null);
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, [selectedUser]);

  // Scroll to bottom — sirf message send pe call hoga
  const handleScrollToBottom = useCallback(() => {
    messageListRef.current?.scrollToBottom();
  }, []);

  const handleSelect = useCallback(
    (msgId, startSelecting = false) => {
      if (startSelecting && !isSelecting) {
        setIsSelecting(true);
        setSelectedIds(new Set([msgId]));
        return;
      }
      if (!isSelecting) return;
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(msgId)) {
          next.delete(msgId);
          if (next.size === 0) setIsSelecting(false);
        } else {
          next.add(msgId);
        }
        return next;
      });
    },
    [isSelecting],
  );

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    if (deleteMessages) {
      await deleteMessages(ids, "forMe");
    } else {
      await Promise.all(ids.map((id) => deleteMessage(id, "forMe")));
    }
    toast.success(`${ids.length} message${ids.length > 1 ? "s" : ""} deleted`);
    setSelectedIds(new Set());
    setIsSelecting(false);
  }, [selectedIds, deleteMessage, deleteMessages]);

  const handleCancelSelection = useCallback(() => {
    setSelectedIds(new Set());
    setIsSelecting(false);
  }, []);

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

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {isSelecting ? (
        <SelectionBar
          selectedCount={selectedIds.size}
          onDelete={handleDeleteSelected}
          onCancel={handleCancelSelection}
        />
      ) : (
        <ChatHeader />
      )}

      <MessageList
        ref={messageListRef}
        onReply={(msg) => setReplyTo(msg)}
        isSelecting={isSelecting}
        selectedIds={selectedIds}
        onSelect={handleSelect}
      />

      {!isSelecting && (
        <>
          <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
          <MessageInput
            replyTo={replyTo}
            onReplyCancel={() => setReplyTo(null)}
            typingTimeoutRef={typingTimeoutRef}
            onMessageSent={handleScrollToBottom} // ← scroll callback
          />
        </>
      )}
    </div>
  );
};

export default ChatContainer;