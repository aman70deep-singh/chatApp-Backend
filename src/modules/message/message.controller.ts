import { Request, Response } from "express";
import { sendMessageValidationSchema } from "./message.validator";
import * as messageService from "./message.service";

export const sendMessageHandler = async (req: Request, res: Response) => {
  try {
    const validateData = sendMessageValidationSchema.parse(req.body);
    const message = await messageService.sendMessage(
      (req as any).user.userId,
      validateData
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
    if (!chatId) {
      return res.status(400).json({
        message: "chatId is required",
        success: false,
      });
    }
    const messages = await messageService.getMessages(chatId);

    return res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
