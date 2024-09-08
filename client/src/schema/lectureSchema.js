import { z } from 'zod';

const lectureFormSchema = z.object({
    title: z
        .string()
        .min(3, 'At least 3 characters required')
        .max(500, 'At most 500 characters allowed'),
    description: z.any(),
    thumbnail: z.any(),
    videoFile: z.any(),
});

export default lectureFormSchema;
