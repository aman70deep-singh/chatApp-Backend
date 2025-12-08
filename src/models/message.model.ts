import mongoose from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    content: string;
    chatId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
    },
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Chat'
    },
},
    { timestamps: true }
)

const message = mongoose.model<IMessage>("Message", messageSchema)
export default message;

