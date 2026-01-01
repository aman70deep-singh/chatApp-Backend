import z from 'zod';

export const updateUserProfileValidationSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).optional(),
    bio: z.string().optional(),
});

export const validateSearchUserSchema = z.object({
    query: z.string().min(1, { message: 'Query string is required' })
})