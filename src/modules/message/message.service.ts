import cloudinary from "../../config/cloudinary";
import ChatModel from "../../models/chat.model";
import MessageModel from "../../models/message.model";
import { getIO } from "../../socket/socket";
import { Types } from "mongoose";
export async function sendMessage(senderId: string, data: any, file?: any) {
  const chat = await ChatModel.findById(data.chatId);
  if (!chat) {
    throw new Error("Chat is not found");
  }
  const receiverId = chat.userIds.find(
    (u: any) => u.toString() !== senderId.toString()
  );

  let messagePayload: any = {
    sender: senderId,
    chatId: data.chatId,
    receiver: receiverId as any,
    type: "text",
    content: data.content
  }
  if (file) {
    const imageUrl = await uploadImage(file);
    messagePayload = {
      ...messagePayload,
      type: "image",
      imageUrl,
      content: "image"
    }
  }

  let createdMessage = await new MessageModel(
    messagePayload
  ).save();

  createdMessage = await createdMessage.populate(
    "sender",
    "name email profilePic"
  );
  createdMessage = await createdMessage.populate({
    path: "chatId",
    populate: {
      path: "userIds",
      select: "name email profilePic",
    },
  });

  await ChatModel.findByIdAndUpdate(data.chatId, {
    latestMessage: createdMessage._id,
  });
  const io = getIO();
  io.to(data.chatId).emit("message-received", createdMessage);

  return createdMessage;
}

export async function getMessages(
  chatId: string,
  cursor?: string,
  limit: number = 20

) {
  const query: any = { chatId };
  if (cursor) {
    query._id = { $lt: new Types.ObjectId(cursor) };
  }
  const messages = await MessageModel
    .find(query)
    .populate("sender", "name  profilePic")
    .sort({ _id: -1 })
    .limit(limit + 1);
  const hasNextPage = messages.length > limit;
  const results = hasNextPage ? messages.slice(0, limit) : messages;

  return {
    messages: results,
    nextCursor: hasNextPage ? results[results.length - 1]?._id.toString() : null,
    hasNextPage
  };

}

export async function uploadImage(file: any) {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: "uploaded-images",
      }
    );
    return result.secure_url
  } catch (error) {
    throw error;
  }
}