import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { socket, axios } = useContext(AuthContext);

  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getMessages = async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    if (!selectedUser?._id) return;
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteMessage = async (messageId, deleteType) => {
    try {
      const { data } = await axios.delete(`/api/messages/${messageId}`, {
        data: { deleteType },
      });
      if (data.success) {
        if (deleteType === "forMe") {
          setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
          toast.success("Message deleted");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ──────────────────────────────────────────
  // REACT TO MESSAGE
  // ──────────────────────────────────────────
  const reactToMessage = async (messageId, emoji) => {
    try {
      const { data } = await axios.post(`/api/messages/react/${messageId}`, {
        emoji,
      });
      if (data.success) {
        // Optimistic update — socket se bhi aayega
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, reactions: data.reactions } : msg,
          ),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ──────────────────────────────────────────
  // SOCKET
  // ──────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentSelectedUser = selectedUserRef.current;
      const senderId = newMessage.senderId?.toString();
      const currentUserId = currentSelectedUser?._id?.toString();

      if (currentSelectedUser && senderId === currentUserId) {
        setMessages((prev) => [...prev, { ...newMessage, status: "seen" }]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    const handleMessageDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId && msg.status === "sent"
            ? { ...msg, status: "delivered" }
            : msg,
        ),
      );
    };

    const handleMessageSeen = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "seen" } : msg,
        ),
      );
    };

    const handleMessageDeleted = ({ messageId, deleteType }) => {
      if (deleteType === "forEveryone") {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        toast.success("Message was deleted");
      }
    };

    // Real-time reaction update
    const handleMessageReaction = ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg,
        ),
      );
    };

    const handleTyping = ({ senderId }) => {
      if (senderId?.toString() === selectedUserRef.current?._id?.toString()) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId?.toString() === selectedUserRef.current?._id?.toString()) {
        setIsTyping(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messageSeen", handleMessageSeen);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messageReaction", handleMessageReaction);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messageSeen", handleMessageSeen);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messageReaction", handleMessageReaction);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    isLoading,
    isTyping,
    getUsers,
    getMessages,
    sendMessage,
    deleteMessage,
    reactToMessage,
    setSelectedUser,
    setMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};