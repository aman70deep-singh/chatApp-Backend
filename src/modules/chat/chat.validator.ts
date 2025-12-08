
import z from 'zod';
import user from '../../models/userModel';
export const createChatValidation = z.object({
    isGroupChat: z.boolean().optional(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' }),
    groupAdmin: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid group admin ID format' }).optional(),
    groupName: z.string().min(2, { message: 'Group name must be at least 2 characters long' }).optional(),
})

export const groupDataValidation = z.object({
    groupName: z.string().min(2, { message: 'Group name must be at least 2 characters long' }),
    userIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' })).min(2, { message: 'At least 2 users are required to create a group chat' }),

})