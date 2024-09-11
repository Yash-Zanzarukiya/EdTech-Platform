import mongoose, { Schema } from 'mongoose';

const progressSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        progress: {
            type: Number,
            required: true,
            default: 100,
        },
    },
    { timestamps: true }
);

export const Progress = mongoose.model('Progress', progressSchema);
