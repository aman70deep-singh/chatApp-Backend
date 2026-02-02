import nodemailer from 'nodemailer';
import cloudinary from './config/cloudinary';

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false 
    }
})


export const sendOtpToEmail = async (email: string, otp: string) => {
    const mail = await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
    })
    return mail;
}

export async function uploadImage(file: any) {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            {
                folder: "uploaded-images",
            }
        );
        return result.secure_url
    } catch (error) {
        throw error;
    }
}