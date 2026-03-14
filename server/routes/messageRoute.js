import express from "express"
import { protectedRoutes } from '../middlewares/auth.js';
import { getMessage, getUserForSidebar, markMessageAsSeen } from "../controllers/messageController.js";

const messageRouter = express.Router()

messageRouter.get('/users', protectedRoutes, getUserForSidebar)
messageRouter.get('/:id', protectedRoutes, getMessage)
messageRouter.put('mark/:id', protectedRoutes, markMessageAsSeen)

export default messageRouter
