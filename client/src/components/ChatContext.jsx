// // import { useContext } from "react";
// // import { useState } from "react";
// // import { createContext } from "react";
// // import { AuthContext } from "../../context/AuthContext";
// // import toast from "react-hot-toast";
// // import Message from './../../../server/models/Message';
// // import { useEffect } from "react";

// // export const ChatContext = createContext();
// // export const ChatProvider = ({ children }) => {
// //   const [message, setMessage] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [unseenMessage, setUnseenMessage] = useState({});

// //   const { socket, axios } = useContext(AuthContext);

// //   // function to get all user for sidebar

// //   const getUser = async () => {
// //     try {
// //       const { data } = await axios.get("api/message/users");
// //       if (data.success) {
// //         setUsers(data.users);
// //         setUnseenMessage(data.unseenMessage);
// //       }
// //     } catch (error) {
// //       toast.error(error.message);
// //     }
// //   };

// //   // function to get message for selected user

// //   const getMessage = async () => {
// //     try {
// //       const { data } = await axios.get(`/api/message/${userId}`);
// //       if (data.success) {
// //         setMessage(data.message)
// //       }
// //     } catch (error) {
// //       toast.error(error.message)
// //     }
// //   };

// //   // fucntion to send message to selected user

// //   const sendMessage = async () => {
// //     try {
// //       const { data } = await axios.get(`/api/message/send/${selectedUser._id}, messageData`)
// //       if (data.success) {
// //         setMessage((prevMessage) => [...prevMessage, data.newMessage])
// //       }
// //       else {
// //         toast.error(error.message)
// //       }
// //     } catch (error) {
// //       toast.error(error.message)
// //     }
// //   }

// //   // function to subscribe to message for selected user

// //   const subscribeMessage = async () => {
// //     if (!socket) return
// //     socket.on("newMessage", (newMessage) => {
// //       if (selectedUser && newMessage.senderId === selectedUser._id) {
// //         newMessage.seen = true
// //         setMessage((prevMessage) => [...prevMessage, newMessage])
// //         axios.put(`/api/message/mark${newMessage._id}`)
// //       }
// //       else {
// //         setUnseenMessage(prevUnseenMessage) => ({
// //           ...prevUnseenMessage, [newMessage.senderId] : prevUnseenMessage[newMessage.senderId] ? prevUnseenMessage[newMessage.senderId] + 1 : 1
// //         }))
// //       }
// //     })
// //   }

// // // fucntion to unsubscribe from Message

// // const unsubscribeFromMessage = async() =? {
// //   if(socket) socket.off("newMessage")
// // }

// //   useEffect(() => {
// //     subscribeMessage()
// //     return ()=> unsubscribeFromMessage()
// //   }, [socket, selectedUser])

// // const value = {
// //     message, users, selectedUser, getUser, setMessage, sendMessage, setSelectedUser, unseenMessage, setUnseenMessage
// //   };
// //   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// // };

// import { createContext, useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import toast from "react-hot-toast";

// export const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unseenMessages, setUnseenMessages] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const { socket, axios } = useContext(AuthContext);

//   // ──────────────────────────────────────────
//   // GET ALL USERS FOR SIDEBAR
//   // ──────────────────────────────────────────
//   const getUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/messages/users");
//       if (data.success) {
//         setUsers(data.users);
//         setUnseenMessages(data.unseenMessages || {});
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   // ──────────────────────────────────────────
//   // GET MESSAGES FOR SELECTED USER
//   // ──────────────────────────────────────────
//   const getMessages = async (userId) => {
//     // userId parameter se lo — pehle undefined tha
//     if (!userId) return;
//     setIsLoading(true);
//     try {
//       const { data } = await axios.get(`/api/messages/${userId}`);
//       if (data.success) {
//         setMessages(data.messages);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ──────────────────────────────────────────
//   // SEND MESSAGE
//   // ──────────────────────────────────────────
//   const sendMessage = async (messageData) => {
//     // messageData parameter lo — pehle string ke andar tha
//     if (!selectedUser?._id) return;
//     try {
//       // GET nahi POST hona chahiye — data bhej rahe hain
//       const { data } = await axios.post(
//         `/api/messages/send/${selectedUser._id}`,
//         messageData,
//       );
//       if (data.success) {
//         setMessages((prev) => [...prev, data.newMessage]);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   // ──────────────────────────────────────────
//   // SUBSCRIBE TO NEW MESSAGES — socket
//   // ──────────────────────────────────────────
//   const subscribeToMessages = () => {
//     if (!socket) return;

//     socket.on("newMessage", (newMessage) => {
//       if (selectedUser && newMessage.senderId === selectedUser._id) {
//         // Message currently open conversation ka hai — seedha add karo
//         newMessage.seen = true;
//         setMessages((prev) => [...prev, newMessage]);
//         // Mark as seen
//         axios.put(`/api/messages/mark/${newMessage._id}`);
//       } else {
//         // Doosre user ka message — unseen count badhao
//         setUnseenMessages((prev) => ({
//           ...prev,
//           [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
//         }));
//       }
//     });
//   };

//   // ──────────────────────────────────────────
//   // UNSUBSCRIBE FROM MESSAGES
//   // ──────────────────────────────────────────
//   const unsubscribeFromMessages = () => {
//     if (socket) socket.off("newMessage");
//   };

//   useEffect(() => {
//     subscribeToMessages();
//     return () => unsubscribeFromMessages();
//   }, [socket, selectedUser]);

//   const value = {
//     messages,
//     users,
//     selectedUser,
//     unseenMessages,
//     isLoading,
//     getUsers,
//     getMessages,
//     sendMessage,
//     setSelectedUser,
//     setMessages,
//     setUnseenMessages,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

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