import jwt from "jsonwebtoken";
import UserModel from "../../models/userModel";
import bcrypt from "bcrypt";
import cloudinary from "../../config/cloudinary";
import { generateOtp, sendOtpToEmail } from "../../utils";

export async function createUser(userData: any, file: any) {
  const checkExistingUser = await UserModel.findOne({
    email: userData.email,
  });

  if (checkExistingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await UserModel.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    bio: userData.bio,
  });

  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
}

export async function loginUser(userData: any) {
  try {
    const isUserExist = await UserModel.findOne({
      email: userData.email,
    }).select("+password");
    if (!isUserExist) {
      throw new Error("User does not exist");
    }
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      isUserExist.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      {
        userId: isUserExist._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      {
        userId: isUserExist._id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    const { password, ...user } = isUserExist.toObject();
    return {
      user,
      token,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

export async function getRefreshToken(refreshToken: string) {
  try {
    const decodeToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: string };

    const newAccessToken = jwt.sign(
      { userId: decodeToken.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return newAccessToken;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export async function forgotPassword(email: string) {
  try {
    const user = await UserModel.findOne({
      email: email,
    })
    if (!user) {
      throw new Error("User does not exist");
    }
    const otp = generateOtp();
    user.resetOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try {
      await sendOtpToEmail(email, otp);
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError.message);
      // We still return success or a specific message because the OTP is saved in DB
      // Alternatively, throw error if email is CRITICAL
      throw new Error("Failed to send email. Please try again later.");
    }
  }
  catch (error) {
    throw error;
  }
}

export async function verifyOtp(email: string, otp: string) {
  const user = await UserModel.findOne({ email: email });
  if (!user || user.resetOTP !== otp || user.otpExpiry < new Date()) {
    throw new Error("Invalid or expired OTP");
  }
  return true;
}

export async function resetPassword(email: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await UserModel.updateOne({ email: email },
    {
      $set: { password: hashedPassword },
      $unset: { resetOTP: "", otpExpiry: "" }
    })
}

export async function uploadUserProfilePicService(userId: string, file: any) {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: "profile-pics",
      }
    );

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}
