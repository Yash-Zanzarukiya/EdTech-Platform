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
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: VIDEO_STATUS,
            default: VIDEO_STATUS.PRIVATE,
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);
