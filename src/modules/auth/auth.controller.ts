import { Request, Response } from 'express';
import * as authService from '../auth/auth.service';
import { authLoginValidationSchema, authRegisterValidationSchema } from './auth.validator';

export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const validatedData = authRegisterValidationSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                success: false,
                message: validatedData.error.issues?.[0]?.message || "Invalid input",
            });
        }
        const user = await authService.createUser(validatedData);
        res.status(201).json({
            message: 'User created successfully',
            user: user,
            success: true
        })

    } catch (error: any) {
        res.status(400).json({
            error: error.message,
            success: false
        });
    }

}

export const loginUserHandler = async (req: Request, res: Response) => {
    try {
        const validatedData = authLoginValidationSchema.parse(req.body);
        const { isUserExist, token } = await authService.loginUser(validatedData);
        res.status(200).json({
            message: 'User logged in successfully',
            userInfo: isUserExist,
            token: token
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Invalid login data",
        });
    }
}
