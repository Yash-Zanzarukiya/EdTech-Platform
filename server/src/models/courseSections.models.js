import mongoose, { Schema } from 'mongoose';

const courseSectionsSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
    },
    order: {
        type: Number,
        default: 0,
    },
});

export const CourseSections = mongoose.model(
    'CourseSections',
    courseSectionsSchema
);
