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

// Initialize socket.io Server
export const io = new Server(server, {
  cors: {origin: "*"}
})

// Strore Online user
export const userSocketMap = {}

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log("User connected", userId);
  
  if (userId) userSocketMap[userId] = socket.id

  // Emit online user to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    
  })
})

// Middlewares
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.get("/api/status", (req, res) =>
  res.json({ status: "ok", message: "Server is live" }),
);
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

// DB connect karo pehle, phir server start karo
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });