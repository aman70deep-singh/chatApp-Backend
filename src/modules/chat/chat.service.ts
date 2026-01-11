import ChatModel from "../../models/chat.model";
import MessageModel from "../../models/message.model";
export async function createChat(loggedInUserId: string, data: any) {
    try {
        const checkExistingChat = await ChatModel.findOne({
            userIds: { $all: [loggedInUserId, data.userId] }
        }).populate("userIds", "name email profilePic").populate("latestMessage");
        if (checkExistingChat) {
            return checkExistingChat;
        }
        const chatData = {
            userIds: [loggedInUserId, data.userId],
        };
        const newChat = await ChatModel.create(chatData);
        return newChat.populate("userIds", "name email profilePic");
    }
    catch (error) {
        throw error;
    }

}

export async function getMyChats(loggedInUserId: string) {
    try {
        const myChats = await ChatModel.find({
            userIds: loggedInUserId
        }).populate("userIds", "name email profilePic").populate("latestMessage").sort({ updatedAt: -1 });
        return myChats;
    } catch (error) {
        throw error;
    }
}