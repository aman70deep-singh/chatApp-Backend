import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import chatRoutes from './modules/chat/chat.routes';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes)

export default app;