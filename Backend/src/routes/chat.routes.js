import { Router } from "express";
import { identifyUser } from "../middlewares/auth.middleware.js";
import {
  deleteChat,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

/**
 * @route   POST /api/chats/message
 * @desc    Sends a message and returns the AI response
 * @access  Private
 */
chatRouter.post("/message", identifyUser, sendMessage);

/**
 * @route   GET /api/chats
 * @desc    Lists chats belonging to the authenticated user
 * @access  Private
 */
chatRouter.get("/", identifyUser, getChats);

/**
 * @route   GET /api/chats/:chatId/messages
 * @desc    Lists messages in an owned chat
 * @access  Private
 */
chatRouter.get("/:chatId/messages", identifyUser, getMessages);

/**
 * @route   DELETE /api/chats/delete/:chatId
 * @desc    Deletes an owned chat and its messages
 * @access  Private
 */
chatRouter.delete("/delete/:chatId", identifyUser, deleteChat);

export default chatRouter;
