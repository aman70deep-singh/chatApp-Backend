import { createChatValidation } from "./chat.validator";
import * as chatService from '../chat/chat.service';
import { Request, Response } from "express";

export const createChatHandler = async (req: Request, res: Response) => {
    try {
        const validateData = createChatValidation.parse(req.body);
        const chat = await chatService.createChat((req as any).user.userId, validateData);
        res.status(201).json({
            message: 'Chat created successfully',
            data: chat,
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

export const getMyChatsHandler = async (req: Request, res: Response) => {
    try {
        const myChats = await chatService.getMyChats((req as any).user.userId);
        res.status(200).json({
            message: 'My chats fetched successfully',
            data: myChats,
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

