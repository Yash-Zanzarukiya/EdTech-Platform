import mongoose, { Schema } from 'mongoose';

const sectionContentSchema = new Schema({
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
    },
    order: {
        type: Number,
        default: 0,
    },
});

export const SectionContent = mongoose.model(
    'SectionContent',
    sectionContentSchema
);
