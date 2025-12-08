import Router from 'express';
import { authMiddleware } from '../../Middleware/authMiddleware';
import { getMessageHandler, sendMessageHandler } from './message.controller';

const router = Router();

router.post('/send', authMiddleware, sendMessageHandler);
router.get('/:chatId', authMiddleware, getMessageHandler);

export default router;