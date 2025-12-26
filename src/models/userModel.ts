import { Document, model, Schema } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    profilePic?: string;
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
        default:
            "https://ui-avatars.com/api/?background=random&name=User",
    },
},
    {timestamps:true},

)
const user = model<IUser>("User", userSchema);
export default user;