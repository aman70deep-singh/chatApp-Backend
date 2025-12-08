import { createChatValidation, groupDataValidation } from "./chat.validator";
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

export const createGroupHandler = async (req: Request, res: Response) => {
    try {
        const validateData = groupDataValidation.parse(req.body);
        const createdGroup = await chatService.createGroupChat((req as any).user.userId, validateData);
        res.status(201).json({
            message: 'Group chat created successfully',
            data: createdGroup,
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

export const addUserToGroupHandler = async (req: Request, res: Response) => {
    try {
        const addUser = await chatService.addUserToGroup((req as any).user.userId, req.body);
        res.status(200).json({
            message: 'User added to group successfully',
            data: addUser,
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

export const removeUserFromGroupHandler = async (req: Request, res: Response) => {
    try {
        const removeUser = await chatService.removeUserFromGroup((req as any).user.userId, req.body);
        res.status(200).json({
            message: 'User removed from group successfully',
            data: removeUser,
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}