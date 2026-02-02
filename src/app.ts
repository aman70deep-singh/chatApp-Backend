import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import chatRoutes from "./modules/chat/chat.routes";
import messageRoutes from "./modules/message/message.routes";
import { connectRedis } from './redis'
connectRedis()
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

export default app;
