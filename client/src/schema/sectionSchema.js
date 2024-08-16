import { z } from 'zod';

const sectionSchema = z.object({
    name: z
        .string()
        .min(5, 'At least 5 characters required')
        .max(50, 'At most 50 characters allowed'),
});

export default sectionSchema;
