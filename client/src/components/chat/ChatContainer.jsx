import React, { useRef, useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ReplyPreview from "./ReplyPreview";
import assets from "../../assets/assets";

const ChatContainer = () => {
  const { selectedUser, getMessages } = useContext(ChatContext);
  const typingTimeoutRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    setReplyTo(null);
  }, [selectedUser]);

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
      <ChatHeader />
      <MessageList onReply={(msg) => setReplyTo(msg)} />
      <ReplyPreview replyTo={replyTo} onCancel={() => setReplyTo(null)} />
      <MessageInput
        replyTo={replyTo}
        onReplyCancel={() => setReplyTo(null)}
        typingTimeoutRef={typingTimeoutRef}
      />
    </div>
  );
};

export default ChatContainer;