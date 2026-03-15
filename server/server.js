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

// Allow multiple origins (comma-separated) and fall back to localhost for local dev.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .replace(/^\s*"|"\s*$/g, "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
console.log("Allowed CORS origins:", allowedOrigins);
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, some mobile clients)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("Blocked CORS origin:", origin);
    callback(new Error("Not allowed by CORS"));
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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ──────────────────────────────────────────
// MIDDLEWARES
// ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
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
// START SERVER — bind port immediately (needed by some hosts like Render)
// ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    // Don't exit immediately; keep the server up so hosting platform sees a bound port
  });
