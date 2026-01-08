
import z from 'zod';
export const createChatValidation = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' }),
})

