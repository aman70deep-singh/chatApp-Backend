import Router from 'express';
import { authMiddleware } from '../../Middleware/authMiddleware';
import { getMessageHandler, sendMessageHandler, uploadImageHandler } from './message.controller';
import { upload } from '../../Middleware/upload';

const router = Router();

router.post('/send', authMiddleware, authMiddleware,
    upload.single("image"),
    sendMessageHandler, sendMessageHandler);
router.get('/:chatId', authMiddleware, getMessageHandler);
router.post(
    "/upload-image",
    authMiddleware,
    upload.single("image"),
    uploadImageHandler
);
export default router;