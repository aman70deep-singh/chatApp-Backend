import Router from 'express';
import { authMiddleware } from '../../Middleware/authMiddleware';
import { getMessageHandler, sendMessageHandler, deleteMessageHandler } from './message.controller';
import { upload } from '../../Middleware/upload';

const router = Router();

router.post('/send', authMiddleware,
    upload.single("image"),
    sendMessageHandler);
router.get('/:chatId', authMiddleware, getMessageHandler)
router.delete('/:messageId', authMiddleware, deleteMessageHandler);

export default router;