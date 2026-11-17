import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/chats`,
  withCredentials: true,
});

export async function sendMessage({ message, chatId }) {
  const response = await api.post("/message", {
    message,
    chat: chatId,
  });
  return response.data;
}

export async function getChats() {
  const response = await api.get("/");
  return response.data;
}

export async function getMessages({ chatId }) {
  const response = await api.get(`/${chatId}/messages`);
  return response.data;
}

export async function deleteChats({ chatId }) {
  const response = await api.delete(`/delete/${chatId}`);
  return response.data;
}
