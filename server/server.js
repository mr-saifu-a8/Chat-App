// import express from "express"
// import "dotenv/config"
// import cors from "cors"
// import http from "http"
// import { connectDB } from "./config/db.js"

// const app = express()
// const server = http.createServer(app)

// app.use(express.json({ limit: "4mb" }))
// app.use(cors())

// app.use("/api/status/", (req, res) => res.send("server is live"))

// await connectDB()

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log("Server is running");

// })

import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const server = http.createServer(app);

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