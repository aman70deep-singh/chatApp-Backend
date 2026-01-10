import mongoose from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  chatId: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: string;
  type: string;
  imageUrl: string;
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
    }


  },
  { timestamps: true }
);

const message = mongoose.model<IMessage>("Message", messageSchema);
export default message;
