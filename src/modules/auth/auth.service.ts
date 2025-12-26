import jwt from "jsonwebtoken";
import UserModel from "../../models/userModel";
import bcrypt from "bcrypt";
import cloudinary from "../../config/cloudinary";

export async function createUser(userData: any, file: any) {
  const checkExistingUser = await UserModel.findOne({
    email: userData.email,
  });

  if (checkExistingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const profileUpload = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder: "profile-pics",
    }
  );

  const newUser = await UserModel.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    profilePic: profileUpload.secure_url,
  });

  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
}


export async function loginUser(userData: any) {
  try {
    const isUserExist = await UserModel.findOne({ email: userData.email }).select("+password");
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

export async function uploadUserProfilePicService(
  userId: string,
  file: any
) {
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
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user.profilePic;
}