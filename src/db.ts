import mongoose from "mongoose";
import dotenv from "dotenv"
export async function connectToDatabase() {
    try {
        dotenv.config({ path: './.env' }); // Ensure environment variables are loaded
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is not defined");
        await mongoose.connect(uri);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}