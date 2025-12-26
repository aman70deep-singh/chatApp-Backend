import chatModel from "../../models/chat.model";
import messageModel from "../../models/message.model";
export async function sendMessage(senderId: string, data: any) {
  let createdMessage = await messageModel.create({
    sender: senderId,
    content: data.content,
    chatId: data.chatId,
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
  return createdMessage;
}

export async function getMessages(chatId: string) {
  return messageModel
    .find({ chatId: chatId })
    .populate("sender", "name  profilePic")
    .sort({ createdAt: 1 });
}
