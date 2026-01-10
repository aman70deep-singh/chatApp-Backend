import z from 'zod';
export const sendMessageValidationSchema = z.object({
    chatId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' }),
    content: z.string().optional(),
})

export const imageUploadSchema = z.object({
    mimetype: z
        .string()
        .refine(
            (type) =>
                ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(type),
            { message: "Only image files are allowed" }
        ),

    size: z
        .number()
        .max(5 * 1024 * 1024, "Image size must be less than 5MB"),

    buffer: z.instanceof(Buffer, {
        message: "Invalid image buffer",
    }),
});