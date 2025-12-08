import z from 'zod';
export const sendMessageValidationSchema = z.object({
    chatId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' }),
    content: z.string().min(1, { message: "please enter the message" })

})
