import { z } from 'zod';

const lectureFormSchema = z.object({
    title: z
        .string()
        .min(3, 'At least 3 characters required')
        .max(50, 'At most 50 characters allowed'),
    description: z.string().max(500, 'At most 500 characters allowed'),
    thumbnail: z.any(),
    videoFile: z.any(),
});

export default lectureFormSchema;
