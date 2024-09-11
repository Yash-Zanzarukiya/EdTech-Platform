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
        status: {
            type: String,
            default: 'drafted',
        },
        price: {
            type: Number,
            default: 0,
        },
        hasExam: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

courseSchema.index({ topics: 1 });

export const Course = mongoose.model('Course', courseSchema);
