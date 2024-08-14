import { StatusCodes } from 'http-status-codes';
import { Course, Topic } from '../models/index.js';
import { asyncHandler, handleResponse } from '../utils/index.js';
import mongoose from 'mongoose';

const getAllTopics = asyncHandler(async (_, res) => {
    const topics = await Topic.find({});
    handleResponse(res, StatusCodes.OK, topics, 'Topics fetched successfully');
});

// create topics from string
export const getTopics = async (topicsString, courseId) => {
    let topics = [];

    if (!topicsString) {
        // TODO: Generalize this code to be used in other places
        topics = await Course.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
            {
                $lookup: {
                    from: 'topics',
                    localField: 'topics',
                    foreignField: '_id',
                    as: 'topics',
                },
            },
            { $project: { _id: 0, topics: 1 } },
        ]);
        return topics[0].topics;
    }

    const topicsArray = topicsString.toLowerCase().split(',');

    const existingTopics = await Topic.find({ name: { $in: topicsArray } });

    for (const topic of topicsArray) {
        const existingTopic = existingTopics.find(
            (t) => t.name.toLowerCase() === topic.toLowerCase()
        );

        if (existingTopic) {
            topics.push(existingTopic);
        } else {
            topics.push(await Topic.create({ name: topic }));
        }
    }

    return topics;
};

export default { getAllTopics };
