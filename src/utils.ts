import nodemailer from 'nodemailer';

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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