import Router from 'express';
import { createChatHandler, getMyChatsHandler } from './chat.controller';
import { authMiddleware } from '../../Middleware/authMiddleware';

const router = Router();
router.post('/create-chat', authMiddleware, createChatHandler);
router.get('/my-chats', authMiddleware, getMyChatsHandler);


export default router;