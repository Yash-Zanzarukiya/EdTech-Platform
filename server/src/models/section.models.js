import mongoose, { Schema } from 'mongoose';
import { SECTION_STATUS } from '../constants.js';

const sectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        status: {
            type: String,
            enum: SECTION_STATUS,
            default: SECTION_STATUS.PUBLISHED,
        },
    },
    { timestamps: true }
);

export const Section = mongoose.model('Section', sectionSchema);
