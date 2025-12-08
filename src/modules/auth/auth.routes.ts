import { Router } from "express";
import { createUserHandler, loginUserHandler } from "./auth.controller";

const router = Router();

router.post('/register',createUserHandler);
router.post('/login',loginUserHandler);
export default router;