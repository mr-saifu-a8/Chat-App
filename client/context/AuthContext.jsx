import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// VITE_BACKEND_URL is configured at build time (in .env / Render/Vercel env vars).
// If it is missing in a deployment, we fall back to a relative API path so the app can work
// when backend is served from the same origin.
const backendUrl = (import.meta.env.VITE_BACKEND_URL ?? "")
  .replace(/(^\"|\"$)/g, "")
  .trim();
if (!backendUrl) {
  console.warn(
    "VITE_BACKEND_URL is not set. The app will attempt to use a relative API path (same origin).\n" +
      "For deployments where the backend runs on a different domain, set VITE_BACKEND_URL to the backend URL.",
  );
}
axios.defaults.baseURL = backendUrl || undefined;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = (userData) => {
    if (!userData?._id || socket?.connected) return;

    // If backendUrl is empty, socket.io will connect to the current origin.
    const newSocket = io(backendUrl || undefined, {
      query: { userId: userData._id },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = (socketInstance) => {
    if (socketInstance?.connected) {
      socketInstance.disconnect();
    }
  };

  // ──────────────────────────────────────────
  // CHECK AUTH
  // ──────────────────────────────────────────
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.userData); // "userData" — backend se match
        connectSocket(data.userData);
      } else {
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
    }
  };

  // ──────────────────────────────────────────
  // LOGIN / SIGNUP
  // ──────────────────────────────────────────
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setAuthUser(data.userData);
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ──────────────────────────────────────────
  // LOGOUT
  // ──────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    disconnectSocket(socket);
    setSocket(null);
    toast.success("Logged out successfully");
  };

  // ──────────────────────────────────────────
  // UPDATE PROFILE
  // ──────────────────────────────────────────
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.userData); // "userData" — backend se match
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ──────────────────────────────────────────
  // APP LOAD
  // ──────────────────────────────────────────
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();

    return () => {
      disconnectSocket(socket);
    };
  }, []);

  const value = {
    axios,
    authUser,
    setAuthUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
