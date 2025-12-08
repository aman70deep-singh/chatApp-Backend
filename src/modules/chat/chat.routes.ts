import Router from 'express';
import { addUserToGroupHandler, createChatHandler, createGroupHandler, getMyChatsHandler, removeUserFromGroupHandler } from './chat.controller';
import { authMiddleware } from '../../Middleware/authMiddleware';

const router = Router();
router.post('/create-chat', authMiddleware, createChatHandler);
router.get('/my-chats', authMiddleware, getMyChatsHandler);
router.post('/create-group', authMiddleware, createGroupHandler);
router.put('/add-user-to-group', authMiddleware, addUserToGroupHandler);
router.put('/remove-user-from-group', authMiddleware, removeUserFromGroupHandler);

export default router;