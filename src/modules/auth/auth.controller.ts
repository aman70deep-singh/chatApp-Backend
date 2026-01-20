import { Request, Response } from "express";
import * as authService from "../auth/auth.service";
import {
  authLoginValidationSchema,
  authRegisterValidationSchema,
  profilePicFileSchema,
} from "./auth.validator";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const validatedData = authRegisterValidationSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: validatedData.error.issues?.[0]?.message || "Invalid input",
      });
    }
    const user = await authService.createUser(validatedData.data, req.file);
    res.status(201).json({
      message: "User created successfully",
      user: user,
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
      success: false,
    });
  }
};

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const validatedData = authLoginValidationSchema.parse(req.body);
    const { user, token, refreshToken } = await authService.loginUser(
      validatedData
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      userInfo: user,
      token: token,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Invalid login data",
    });
  }
};
export const getRefreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }
    const newAccessToken = await authService.getRefreshToken(refreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    res.status(401).json({
      message: error.message || "Invalid refresh token",
    });
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        message: "Email is required"
      })
    }
    await authService.forgotPassword(email);
    res.status(200).json({
      message: "OTP sent to email successfully"
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({
        message: "Email and otp is required"
      })
    }
    await authService.verifyOtp(email, otp);
    res.status(200).json({
      message: "OTP verified successfully"
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const resetPasswordHandler =  async (req:Request,res:Response)=>{
  try {
    const {email,newPassword} = req.body;
    if(!email || !newPassword){
      res.status(400).json({
        message:"Email and new password is required"
      })
    }
    await authService.resetPassword(email,newPassword);
    res.status(200).json({
      message:"Password updated successfully"
    })
  } catch (error:any) {
    res.status(400).json({
      message:error.message
    })
  }
}


export const uploadProfilePicHandler = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const result = profilePicFileSchema.safeParse(req.file);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message || "Invalid file",
      });
    }

    const user = await authService.uploadUserProfilePicService(
      userId,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};
