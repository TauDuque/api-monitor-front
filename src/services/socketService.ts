// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000"; // URL do seu backend

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.io connection error:", err.message);
    });
  }
  return socket;
};
