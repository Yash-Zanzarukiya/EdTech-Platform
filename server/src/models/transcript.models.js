import mongoose, { Schema } from 'mongoose';

const TranscriptSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        transcript: {
            type: String,
            default: 'No Transcripts Available',
        },
        summary: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

export const Transcript = mongoose.model('Transcript', TranscriptSchema);
