import { z } from 'zod';

const courseFormSchema = z.object({
    name: z.string().min(3, 'At least 3 characters required'),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    description: z.string(),
    thumbnail: z.any(),
});

export default courseFormSchema;
