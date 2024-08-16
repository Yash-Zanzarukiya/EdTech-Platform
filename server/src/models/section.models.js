import mongoose, { Schema } from 'mongoose';
import { SECTION_STATUS } from '../constants.js';

const videoSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
    },
    order: {
        type: Number,
        default: 1,
    },
});

const quizSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
    },
    order: {
        type: Number,
        default: 1,
    },
});

const sectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            default: 1,
        },
        videos: [videoSchema],
        quizzes: [quizSchema],
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        status: {
            type: String,
            enum: SECTION_STATUS,
            default: SECTION_STATUS.UNPUBLISHED,
        },
    },
    { timestamps: true }
);

export const Section = mongoose.model('Section', sectionSchema);
