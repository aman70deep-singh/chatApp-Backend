import chatModel from "../../models/chat.model";
import messageModel from "../../models/message.model";
import { getIO } from "../../socket/socket";
export async function sendMessage(senderId: string, data: any) {
  const chat = await chatModel.findById(data.chatId);
  if (!chat) {
    throw new Error("Chat is not found");
  }
  const receiverId = chat.userIds.find(
    (u: any) => u.toString() !== senderId.toString()
  );

  let createdMessage = await messageModel.create({
    sender: senderId,
    content: data.content,
    chatId: data.chatId,
    receiver: receiverId as any,
  });

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
