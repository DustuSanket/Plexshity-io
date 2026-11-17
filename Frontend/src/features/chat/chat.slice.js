import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      const currentChat = state.chats[chatId];
      state.chats[chatId] = {
        id: chatId,
        title: title || currentChat?.title || "New conversation",
        messages: currentChat?.messages || [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({ content, role });
      state.chats[chatId].lastUpdated = new Date().toISOString();
    },
    setChatMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].messages = messages;
      }
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];
      if (String(state.currentChatId) === String(chatId)) {
        state.currentChatId = null;
      }
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  setChatMessages,
  removeChat,
} = chatSlice.actions;

export default chatSlice.reducer;
