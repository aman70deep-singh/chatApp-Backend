import { Server } from "socket.io";
import messageModel from "../models/message.model";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
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

    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", userId);
    });

    socket.on("stop-typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("stop-typing", userId);
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
      if (!chat) return console.log("Chat not found in message event");

      socket.to(chat._id).emit("receive-message", message);
      console.log("Message sent in room:", chat);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
