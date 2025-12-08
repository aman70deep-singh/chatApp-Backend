import { Request, Response } from 'express';
import * as  userService from './user.service';
import { updateUserProfileValidationSchema, validateSearchUserSchema } from './user.validator';
export const getUserProfileHandler = async (req: Request, res: Response) => {
    try {

        const user = await userService.getUserProfile((req as any).user.userId);
        res.status(200).json({
            message: 'User profile fetched successfully',
            user: user
        });

    }
    catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

export const updateUserProfileHandler = async (req: Request, res: Response) => {

    try {
        const validateData = updateUserProfileValidationSchema.parse(req.body);

        const user = await userService.updateUserProfile((req as any).user.userId, validateData);
        res.status(200).json({
            message: 'User profile update successfully',
            user: user
        });

    }
    catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

export const searchUsersHandler = async (req: Request, res: Response) => {
    try {
        const query = validateSearchUserSchema.parse(req.query);
        const usersSearch = await userService.searchUsers(query.query, (req as any).user.userId);
        res.status(200).json({
            users: usersSearch
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        });
    }
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                message: "userId is required",
                success: false
            })
        }
        const user = await userService.getUserById(userId);
        res.status(200).json({
            message: 'User fetched successfully',
            user: user
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}
