import { Router } from "express";
import { createUserHandler, forgotPasswordHandler, getRefreshTokenHandler, loginUserHandler, resetPasswordHandler, uploadProfilePicHandler, verifyOtpHandler } from "./auth.controller";
import { authMiddleware } from "../../Middleware/authMiddleware";
import { upload } from "../../Middleware/upload";

const router = Router();

router.post("/register", createUserHandler);
router.post("/login", loginUserHandler);
router.post("/refresh-token", getRefreshTokenHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/verify-otp", verifyOtpHandler);
router.patch("/reset-password", resetPasswordHandler);
router.post(
  "/upload-profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  uploadProfilePicHandler
);
export default router;
