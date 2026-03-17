import express from "express";
import {
  getUserForSidebar,
  getMessage,
  sendMessage,
  markMessageAsSeen,
  deleteMessage,
  reactToMessage,
} from "../controllers/messageController.js";
import { protectedRoutes } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedRoutes, getUserForSidebar);
messageRouter.get("/:id", protectedRoutes, getMessage);
messageRouter.post("/send/:id", protectedRoutes, sendMessage);
messageRouter.put("/mark/:id", protectedRoutes, markMessageAsSeen);
messageRouter.delete("/:id", protectedRoutes, deleteMessage);
messageRouter.post("/react/:id", protectedRoutes, reactToMessage);

export default messageRouter;