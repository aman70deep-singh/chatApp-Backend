import z from 'zod';

export const authRegisterValidationSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    bio: z.string().optional(),
});

export const authLoginValidationSchema = z.object({
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(1,{message:'Password is required'}),
})

export const profilePicFileSchema = z.object({
  mimetype: z
    .string()
    .refine(
      (type) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(type),
      { message: "Only image files are allowed" }
    ),

  size: z
    .number()
    .max(2 * 1024 * 1024, "Image size must be less than 2MB"),

  buffer: z.instanceof(Buffer, {
    message: "Invalid image buffer",
  }),
});