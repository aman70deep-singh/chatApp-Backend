
import chatModel from "../../models/chat.model";
export async function createChat(loggedInUserId: string, data: any) {
    try {
        const checkExistingChat = await chatModel.findOne({
            isGroupChat: false,
            userIds: { $all: [loggedInUserId, data.userId] }
        }).populate("userIds", "name email profilePic").populate("latestMessage");
        if (checkExistingChat) {
            return checkExistingChat;
        }
        const chatData = {
            isGroupChat: false,
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

export async function createGroupChat(loggedInUserId: string, data: any) {
    if (!data.userIds.includes(loggedInUserId)) data.userIds.push(loggedInUserId);
    const groupChatData = {
        isGroupChat: true,
        userIds: data.userIds,
        groupName: data.groupName,
        groupAdmin: loggedInUserId,
    }
    const createGroup = await chatModel.create(groupChatData);
    return createGroup.populate("userIds", "name email profilePic");
}

export async function addUserToGroup(requesterId: string, data: any) {
    try {
        const chat = await chatModel.findById(data.chatId);
        if (!chat) {
            throw new Error("Chat not found");
        }
        if (!chat.isGroupChat) {
            throw new Error("Cannot add users to a non-group chat");
        }
        if (!chat.groupAdmin || chat.groupAdmin.toString() !== requesterId) {
            throw new Error("Only group admin can add users");
        }
        const addedUser = await chatModel.findByIdAndUpdate(
            data.chatId,
            { $addToSet: { userIds: data.userId } },
            { new: true }
        )
        return addedUser;
    } catch (error) {
        throw error;
    }
}

export async function removeUserFromGroup(requesterId: string, data: any) {
    try {
        const chat = await chatModel.findById(data.chatId);
        if (!chat) {
            throw new Error("Chat not found");
        }
        if (!chat.isGroupChat) {
            throw new Error("Cannot remove users from a non-group chat");
        }
        if (!chat.groupAdmin || chat.groupAdmin.toString() !== requesterId) {
            throw new Error("Only group admin can remove users");
        }
        const removedUser = await chatModel.findByIdAndUpdate(
            data.chatId,
            { $pull: { userIds: data.userId } },
            { new: true }
        )
        return removedUser;
    } catch (error) {
        throw error;
    }
}