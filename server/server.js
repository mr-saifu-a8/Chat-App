import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-frontend-jl1l.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ──────────────────────────────────────────
// SOCKET.IO
// ──────────────────────────────────────────
export const io = new Server(server, {
  cors: corsOptions,
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.warn("Socket connected without userId — ignoring");
    return;
  }

  console.log(`User connected: ${userId}`);
  userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ── Typing indicators ──
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  // ── Message delivered ──
  // Jab receiver online ho aur message receive kare
  socket.on("messageDelivered", ({ messageId, senderId }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDelivered", { messageId });
    }
  });

  // ── Message seen ──
  socket.on("messageSeen", ({ messageId, senderId }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSeen", { messageId });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ──────────────────────────────────────────
// MIDDLEWARES
// ──────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

// ──────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────
app.get("/api/status", (req, res) =>
  res.json({ status: "ok", message: "Server is live" }),
);
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ──────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("DB connection failed:", err);
  });