import { Document, model, Schema } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    profilePic?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    email: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    
    },
    bio:{
        type:String,
        default: "Hey there! I am using WhatsApp.",
    }
},
    {timestamps:true},

)
const user = model<IUser>("User", userSchema);
export default user;