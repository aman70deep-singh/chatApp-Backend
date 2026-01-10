import cloudinary from "../../config/cloudinary";
import chatModel from "../../models/chat.model";
import messageModel from "../../models/message.model";
import { getIO } from "../../socket/socket";
export async function sendMessage(senderId: string, data: any, file?: any) {
  const chat = await chatModel.findById(data.chatId);
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

  let createdMessage = await new messageModel(
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

  await chatModel.findByIdAndUpdate(data.chatId, {
    latestMessage: createdMessage._id,
  });
  const io = getIO();
  io.to(data.chatId).emit("message-received", createdMessage);

  return createdMessage;
}

export async function getMessages(chatId: string) {
  return messageModel
    .find({ chatId: chatId })
    .populate("sender", "name  profilePic")
    .sort({ createdAt: 1 });
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