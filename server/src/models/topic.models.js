import mongoose, { Schema } from 'mongoose';

const topicSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
});

export const Topic = mongoose.model('Topic', topicSchema);
