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
  const { selectedUser, getMessages, deleteMessage, deleteMessages, messages } =
    useContext(ChatContext);
  const typingTimeoutRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const messageListRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    setReplyTo(null);
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, [selectedUser]);

  const handleScrollToBottom = useCallback(() => {
    messageListRef.current?.scrollToBottom();
  }, []);

  // ── Select / Deselect ek message ──
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

  // ── Select All / Deselect All ──
  const handleSelectAll = useCallback(() => {
    const allIds = messages.map((msg) => msg._id);
    const allSelected = allIds.every((id) => selectedIds.has(id));

    if (allSelected) {
      // Sab selected hain — sab unselect karo
      setSelectedIds(new Set());
    } else {
      // Sab select karo
      setSelectedIds(new Set(allIds));
    }
  }, [messages, selectedIds]);

  // ── Delete selected ──
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

  // ── Cancel selection ──
  const handleCancelSelection = useCallback(() => {
    setSelectedIds(new Set());
    setIsSelecting(false);
  }, []);

  // All selected check
  const allSelected =
    messages.length > 0 && messages.every((msg) => selectedIds.has(msg._id));

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
          totalCount={messages.length}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
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
            onMessageSent={handleScrollToBottom}
          />
        </>
      )}
    </div>
  );
};

export default ChatContainer;