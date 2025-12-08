import { Request, Response } from 'express';
import * as authService from '../auth/auth.service';
import { authLoginValidationSchema, authRegisterValidationSchema } from './auth.validator';
import { userInfo } from 'os';
export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const validatedData = authRegisterValidationSchema.parse(req.body);
        const user = await authService.createUser(validatedData);
        res.status(201).json({
            message: 'User created successfully',
            user: user
        })

    } catch (error: any) {
        res.status(400).json({
            message: 'Error creating user',
            error: error.message
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
            message: "error logging in user",
            error: error.message
        })
    }
}