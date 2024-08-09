import { z } from 'zod';

const signInSchema = z.object({
    identifier: z
        .string()
        .min(3, 'Identifier must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default signInSchema;
