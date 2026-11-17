import { Server } from "socket.io";

let io;

export function initSocket(httplServer) {
  io = new Server(httplServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  console.log("Socket.io server is running");

  io.on("connection", (socket) => {
    console.log("A user connected " + socket.id);
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}
