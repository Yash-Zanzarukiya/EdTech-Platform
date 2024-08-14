import mongoose, { Schema } from 'mongoose';

const topicSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
    },
    { timestamps: true }
);

topicSchema.index({ _id: 1 });

export const Topic = mongoose.model('Topic', topicSchema);
