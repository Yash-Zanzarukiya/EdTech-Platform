import mongoose, { Schema } from 'mongoose';

const topicListSchema = new Schema(
    {
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
        },
        quiz: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
        },
        goal: {
            type: Schema.Types.ObjectId,
            ref: 'Goal',
        },
    },
    { timestamps: true }
);

export const TopicList = mongoose.model('TopicList', topicListSchema);
