import mongoose from 'mongoose'
export interface IChat extends Document {
    isGroupChat: boolean;
    userIds: mongoose.Types.ObjectId[];
    groupAdmin?: mongoose.Types.ObjectId;
    groupName?: string;
    latestMessage?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new mongoose.Schema<IChat>({
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    groupName: {
        type: String,
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }
},
    { timestamps: true },
)
const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;