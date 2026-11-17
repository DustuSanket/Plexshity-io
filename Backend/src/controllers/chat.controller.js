import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

/**
 * @desc    Creates a chat when needed, saves the user's message, and returns an AI reply
 * @route   POST /api/chats/message
 * @access  Private
 */
export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let chat = null;
  let titlePromise = null;

  if (!chatId) {
    titlePromise = generateChatTitle(message).then(
      (title) => ({ title }),
      (error) => ({ error }),
    );
    chat = await chatModel.create({
      user: req.user.id,
      title:
        message.trim().replace(/\s+/g, " ").slice(0, 48) ||
        "New conversation",
    });
  }

  const activeChatId = chatId || chat._id;
  const userMessage = await messageModel.create({
    chat: activeChatId,
    content: message,
    role: "user",
  });

  const allMessages = await messageModel
    .find({ chat: activeChatId })
    .sort({ createdAt: -1, _id: -1 })
    .limit(20)
    .lean();
  allMessages.reverse();

  let result;
  if (titlePromise) {
    const titleUpdatePromise = titlePromise.then(async (titleResult) => {
      if (titleResult.error) {
        console.error("Chat title generation failed:", titleResult.error);
        return;
      }

      const generatedTitle = titleResult.title?.trim();
      if (!generatedTitle) {
        console.error("Chat title generation returned an empty title.");
        return;
      }

      chat.title = generatedTitle;
      await chat.save();
    });

    [result] = await Promise.all([
      generateResponse(allMessages),
      titleUpdatePromise,
    ]);
  } else {
    result = await generateResponse(allMessages);
  }

  const aiMessage = await messageModel.create({
    chat: activeChatId,
    content: result,
    role: "ai",
  });

  return res.status(201).json({
    chat,
    userMessage,
    aiMessage,
  });
}

/**
 * @desc    Returns all chats owned by the authenticated user
 * @route   GET /api/chats
 * @access  Private
 */
export async function getChats(req, res) {
  const user = req.user;

  const allChats = await chatModel.find({ user: user.id });

  return res.status(200).json({
    message: "Chats retrived successfully",
    allChats,
  });
}

/**
 * @desc    Returns the messages for a chat owned by the authenticated user
 * @route   GET /api/chats/:chatId/messages
 * @access  Private
 * @param   {string} chatId - The chat ID from the URL
 */
export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const allMessages = await messageModel.find({
    chat: chatId,
  });

  return res.status(200).json({
    message: "Messages retrived successfully",
    allMessages,
  });
}

/**
 * @desc    Deletes a chat owned by the authenticated user and its messages
 * @route   DELETE /api/chats/delete/:chatId
 * @access  Private
 * @param   {string} chatId - The chat ID from the URL
 */
export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  await messageModel.deleteMany({
    chat: chatId,
  });

  return res.status(200).json({
    message: "Chat deleted successfully",
  });
}
