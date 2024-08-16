import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { VIDEO_STATUS } from '../constants.js';

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        topics: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Topic',
            },
        ],
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: VIDEO_STATUS,
            default: VIDEO_STATUS.PRIVATE,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);
