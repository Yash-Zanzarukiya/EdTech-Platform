import { z } from 'zod';

const userProfileSchema = z.object({
    fullName: z.string().min(3, 'Name required at-least 3 characters'),
    university: z.string('University name is required'),
    gradYear: z.number().min(0, 'Graduation Year must be a positive number'),
    branch: z.string('Branch name is required'),
    bio: z.string(),
    avatar: z.any(),
});

export default userProfileSchema;
