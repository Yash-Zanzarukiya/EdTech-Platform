import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        price: {
            type: Number,
        },
        duration: {
            type: Number,
        },
        topics: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Topic',
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
