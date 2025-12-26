import { Router } from "express";
import { createUserHandler, getRefreshTokenHandler, loginUserHandler, uploadProfilePicController } from "./auth.controller";
import { authMiddleware } from "../../Middleware/authMiddleware";
import { upload } from "../../Middleware/upload";

const router = Router();

router.post("/register", createUserHandler);
router.post("/login", loginUserHandler);
router.post("/refresh-token", getRefreshTokenHandler);
router.post(
    "/upload-profile-pic",
    authMiddleware,
    upload.single("profilePic"),
    uploadProfilePicController
  );
  export default router;
