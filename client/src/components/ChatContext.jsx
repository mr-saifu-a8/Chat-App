import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { socket, axios } = useContext(AuthContext);

  // Ref use karo selectedUser ke liye — stale closure problem fix
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // ──────────────────────────────────────────
  // GET ALL USERS FOR SIDEBAR
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // GET MESSAGES FOR SELECTED USER
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // SEND MESSAGE
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // SOCKET — real-time messages
  // selectedUserRef use karo — stale closure nahi hogi
  // ──────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentSelectedUser = selectedUserRef.current;

      // senderId string me convert karo comparison ke liye
      const senderId = newMessage.senderId?.toString();
      const currentUserId = currentSelectedUser?._id?.toString();

      if (currentSelectedUser && senderId === currentUserId) {
        // Conversation open hai — message add karo aur seen mark karo
        setMessages((prev) => [...prev, { ...newMessage, seen: true }]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        // Background mein aaya — unseen count badhao
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup — memory leak nahi hoga
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]); // sirf socket pe depend karo — selectedUser nahi

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    isLoading,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};