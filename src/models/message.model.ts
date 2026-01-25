import mongoose from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  chatId: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: string;
  type: string;
  imageUrl: string;
  isDeleted: boolean; 
  deletedBy: mongoose.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,

    },
    chatId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "text"],
      default: "text",
    },
    imageUrl: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
messageSchema.index({
  receiver: 1,
  status: 1,
  chatId: 1
})
messageSchema.index({
  chatId: 1,
  _id: -1
})

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
