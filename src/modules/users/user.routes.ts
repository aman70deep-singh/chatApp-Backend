

import Router from 'express';
import { getUserByIdHandler, getUserProfileHandler, searchUsersHandler, updateUserProfileHandler } from './user.controller';
import { authMiddleware } from '../../Middleware/authMiddleware';
const router = Router();

router.get('/profile', authMiddleware, getUserProfileHandler);
router.put('/profile', authMiddleware, updateUserProfileHandler);
router.get('/search', authMiddleware, searchUsersHandler);
router.get('/:id', authMiddleware, getUserByIdHandler);

export default router;