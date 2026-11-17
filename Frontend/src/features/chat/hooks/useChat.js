import {
  sendMessage,
  getChats,
  getMessages,
  deleteChats,
} from "../services/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  setChatMessages,
  removeChat,
} from "../chat.slice";
import { initializeSocketConnection } from "../services/chat.socket";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function sendMessageHandler({ message, chatId }) {
    dispatch(setError(null));
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
      const { chat, userMessage, aiMessage } = data;
      const returnedChatId = chat?._id || chat?.id || userMessage?.chat;
      const resolvedChatId = returnedChatId?.toString?.() || chatId;

      if (!resolvedChatId || !userMessage || !aiMessage) {
        throw new Error("The message response is missing chat or message data.");
      }

      dispatch(
        createNewChat({
          chatId: resolvedChatId,
          title:
            chat?.title ||
            chats[resolvedChatId]?.title ||
            message.trim().slice(0, 48) ||
            "New conversation",
        }),
      );
      dispatch(
        addNewMessage({
          chatId: resolvedChatId,
          content: userMessage.content || message,
          role: userMessage.role || "user",
        }),
      );
      dispatch(
        addNewMessage({
          chatId: resolvedChatId,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
      dispatch(setCurrentChatId(resolvedChatId));
      return { success: true };
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errMsg ||
        "Message failed. Please try again later.";
      dispatch(setError(errMsg));
      return {
        success: false,
        errMsg,
        status: err.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function getChatsHandler() {
    dispatch(setError(null));
    try {
      dispatch(setLoading(true));
      const data = await getChats();
      const { allChats } = data;
      dispatch(
        setChats(
          allChats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
      return { success: true };
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errMsg ||
        "Chats failed to load. Please try again later.";
      dispatch(setError(errMsg));
      return {
        success: false,
        errMsg,
        status: err.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function openMessagesHandler({ chatId }) {
    dispatch(setError(null));
    const cachedMessages = chats[String(chatId)]?.messages;

    if (Array.isArray(cachedMessages) && cachedMessages.length > 0) {
      dispatch(setCurrentChatId(chatId));
      return { success: true, cached: true };
    }

    try {
      dispatch(setLoading(true));
      const data = await getMessages({ chatId });
      const { allMessages } = data;

      const formattedMessages = allMessages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        setChatMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
      dispatch(setCurrentChatId(chatId));

      return { success: true };
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errMsg ||
        "Messages failed to load. Please try again later.";
      dispatch(setError(errMsg));
      return {
        success: false,
        errMsg,
        status: err.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function deleteChatHandler({ chatId }) {
    dispatch(setError(null));
    try {
      dispatch(setLoading(true));
      const data = await deleteChats({ chatId });
      dispatch(removeChat(chatId));
      return { success: true, data };
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errMsg ||
        "Failed to Delete. Please try again later.";
      dispatch(setError(errMsg));
      return {
        success: false,
        errMsg,
        status: err.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    sendMessageHandler,
    getChatsHandler,
    openMessagesHandler,
    deleteChatHandler,
  };
};
