import mongoose, { Schema } from 'mongoose';

const GoalSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    progress: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const Goal = mongoose.model('Goal', GoalSchema);
