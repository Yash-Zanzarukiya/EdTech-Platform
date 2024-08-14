import { z } from 'zod';

const courseFormSchema = z.object({
    name: z
        .string()
        .min(5, 'At least 5 characters required')
        .max(50, 'At most 50 characters allowed'),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    duration: z
        .number()
        .min(1, { message: 'Duration must be at least 1 hour' }),
    description: z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(500, 'At most 500 characters allowed'),
    thumbnail: z.any(),
});

export default courseFormSchema;
