import mongoose from 'mongoose'



export interface IChat extends Document {
    userIds: mongoose.Types.ObjectId[];
    latestMessage?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new mongoose.Schema<IChat>({

    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }
},
    { timestamps: true },
)
const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;