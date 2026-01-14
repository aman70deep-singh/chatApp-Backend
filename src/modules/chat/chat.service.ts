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

import mongoose from "mongoose";

export async function getMyChats(loggedInUserId: string) {
    try {
        const chats = await ChatModel.find({
            userIds: loggedInUserId
        })
            .populate("userIds", "name email profilePic")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const unreadCounts = await MessageModel.aggregate([
            {
                $match: {
                    receiver: new mongoose.Types.ObjectId(loggedInUserId),
                    status: { $ne: "seen" },
                },
            },
            {
                $group: {
                    _id: "$chatId",
                    unreadCount: { $sum: 1 },
                },
            },
        ]);

        const unreadMap: Record<string, number> = {};
        unreadCounts.forEach((item) => {
            unreadMap[item._id.toString()] = item.unreadCount;
        });

        const chatsWithUnread = chats.map((chat: any) => ({
            ...chat.toObject(),
            unreadCount: unreadMap[chat._id.toString()] || 0,
        }));

        return chatsWithUnread;
    } catch (error) {
        throw error;
    }
}
