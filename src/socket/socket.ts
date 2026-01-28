import { Server } from "socket.io";
import MessageModel from "../models/message.model";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "https://your-frontend-url.vercel.app",
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
      io.to(receiverId).emit("unread-count-updated", {
        chatId: chat._id,
        message
      });


      if (onlineUsers.includes(receiverId)) {
        await MessageModel.findByIdAndUpdate(message._id, {
          status: "delivered",
        });

        io.to(message.sender._id.toString()).emit("message-status-updated", {
          messageId: message._id,
          status: "delivered",
        });
      }
    });

    socket.on("chat-opened", async ({ chatId }) => {
      const userId = (socket as any).userId;
      if (!userId) return;

      await MessageModel.updateMany(
        {
          chatId,
          receiver: userId,
          status: { $ne: "seen" },
        },
        { status: "seen" }
      );


      io.to(chatId).emit("message-seen-ticks", { chatId });

      io.to(userId).emit("reset-unread-count", { chatId });
    });

    socket.on("user-login", async (userId) => {

      (socket as any).userId = userId;
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }
      io.emit("online-users", onlineUsers);
      const pendingMessages = await MessageModel.find({
        receiver: userId,
        status: "sent",
      });
      if (!pendingMessages) return;

      await MessageModel.updateMany(
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
