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

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "chatId is required",
      });
    }

    const result = await messageService.getMessages(
      chatId,
      cursor as string | undefined,
      limit ? Number(limit) : 20
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


