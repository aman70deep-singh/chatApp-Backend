import { Server } from "socket.io";
import messageModel from "../models/message.model";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
      console.log("User room joined:", userData._id);
    });

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log("User joined chat:", chatId);
    });

    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing");
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing");
    });

    socket.on("message-delivered", async (chatId) => {
      await messageModel.updateMany(
        { chatId, status: "sent" },
        { status: "delivered" }
      );
      socket.to(chatId).emit("message-status-updated");
    });
    socket.on("message-seen", async (chatId) => {
      await messageModel.updateMany(
        { chatId, status: "delivered" },
        { status: "seen" }
      );
      socket.to(chatId).emit("message-status-updated");
    });

    socket.on("send-message", (message) => {
      const chat = message.chatId;
      if (!chat) {
        console.log(" Chat not found in message");
        return;
      }

      socket.to(chat._id).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
