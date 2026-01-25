import { Request, Response } from "express";
import { imageUploadSchema, sendMessageValidationSchema } from "./message.validator";
import * as messageService from "./message.service";

export const sendMessageHandler = async (req: Request, res: Response) => {
  try {

    const validateData = sendMessageValidationSchema.safeParse(req.body);
    const message = await messageService.sendMessage(
      (req as any).user.userId,
      validateData.data,
      req.file
    );

    res.status(201).json({
      message: "send message successfully",
      savedMessage: message,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
      success: true,
    });
  }
};

export const getMessageHandler = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { cursor, limit } = req.query;
    const loggedInUser = (req as any).user.userId;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "chatId is required",
      });
    }

    const result = await messageService.getMessages(
      chatId,
      limit ? Number(limit) : 20,
      loggedInUser,
      cursor as string | undefined,
    );

    return res.status(200).json({
      success: true,
      data: {
        messages: result.messages,
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error: any) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

export const deleteMessageHandler = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { type } = req.body; 
    const userId = (req as any).user.userId;

    if (!messageId || !type) {
      return res.status(400).json({
        success: false,
        message: "messageId and type are required",
      });
    }

    await messageService.deleteMessage(messageId, userId, type);

    return res.status(200).json({
      success: true,
      message: `Message deleted for ${type === 'me' ? 'you' : 'everyone'} successfully`,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete message",
    });
  }
};


