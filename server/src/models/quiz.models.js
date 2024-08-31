import mongoose, { Schema } from 'mongoose';

const QuizSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        goal: {
            type: Schema.Types.ObjectId,
            ref: 'Goal',
            required: true,
        },
    },
    { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', QuizSchema);
