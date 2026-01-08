import chatModel from "../../models/chat.model";
export async function createChat(loggedInUserId: string, data: any) {
    try {
        const checkExistingChat = await chatModel.findOne({
            userIds: { $all: [loggedInUserId, data.userId] }
        }).populate("userIds", "name email profilePic").populate("latestMessage");
        if (checkExistingChat) {
            return checkExistingChat;
        }
        const chatData = {
            userIds: [loggedInUserId, data.userId],
        };
        const newChat = await chatModel.create(chatData);
        return newChat.populate("userIds", "name email profilePic");
    }
    catch (error) {
        throw error;
    }

}


export async function getMyChats(loggedInUserId: string) {
    try {
        const myChats = await chatModel.find({
            userIds: loggedInUserId
        }).populate("userIds", "name email profilePic").populate("latestMessage").sort({ updatedAt: -1 });
        return myChats;
    } catch (error) {
        throw error;
    }
}
