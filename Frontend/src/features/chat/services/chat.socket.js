import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const initializeSocketConnection = () => {
  const socket = io(BACKEND_URL, { withCredentials: true });

  socket.on("connect", () => {
    console.log("Connected to Socket.io server");
  });
};
