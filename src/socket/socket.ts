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
  let onlineUsers: Array<string> = [];
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
      console.log("User room joined:", userData._id);
    });

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log("join-chat:", chatId, "socket:", socket.id);
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      console.log("leave-chat:", chatId, "socket:", socket.id);
    });

    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing");
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing");
    });

    socket.on("send-message", async (message) => {
      const receiverId = message.receiver.toString();
      const chat = message.chatId;
      if (!chat) {
        console.log(" Chat not found in message");
        return;
      }

      socket.to(chat._id).emit("receive-message", message);

      if (onlineUsers.includes(receiverId)) {
        await messageModel.findByIdAndUpdate(message._id, {
          status: "delivered",
        });

        io.to(message.sender._id.toString()).emit("message-status-updated", {
          messageId: message._id,
          status: "delivered",
        });
      }
    });

    socket.on("chat-opened", async ({ chatId, userId }) => {

      await messageModel.updateMany(
        {
          chatId,
          receiver: { $ne: userId },
          status: { $ne: "seen" },
        },
        { status: "seen" }
      );


      io.to(chatId).emit("message-seen", { chatId });
    });

    socket.on("user-login", async (userId) => {

      (socket as any).userId = userId;
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }
      io.emit("online-users", onlineUsers);
      const pendingMessages = await messageModel.find({
        receiver: userId,
        status: "sent",
      });
      if (!pendingMessages) return;

      await messageModel.updateMany(
        { receiver: userId, status: "sent" },
        { status: "delivered" }
      );
      pendingMessages.forEach((msg) => {
        io.to(msg.sender.toString()).emit("message-status-updated", {
          messageId: msg._id,
          status: "delivered",
        });
      });
    });

    socket.on("disconnect", () => {
      if ((socket as any).userId) {
        onlineUsers = onlineUsers.filter((id) => id !== (socket as any).userId);
        io.emit("online-users", onlineUsers);
      }
    });
  });

  return io;
};

export const getIO = () => io;
