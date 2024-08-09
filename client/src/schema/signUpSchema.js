import { z } from 'zod';

const usernameValidation = z
    .string()
    .min(2, 'Username must have at least 2 characters')
    .max(20, 'Username must not have more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email('Please enter valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
});

export { usernameValidation };
export default signUpSchema;
