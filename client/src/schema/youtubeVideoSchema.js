import { z } from 'zod';

const youtubeVideoSchema = z.object({
    videoURLs: z
        .array(
            z
                .string()
                .optional()
                .refine(
                    (value) =>
                        value === '' ||
                        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
                            value
                        ),
                    {
                        message: 'Invalid YouTube URL',
                    }
                )
        )
        .refine((urls) => urls.some((url) => url !== ''), {
            message: 'Please provide at least one URL',
        }),
});

export default youtubeVideoSchema;
