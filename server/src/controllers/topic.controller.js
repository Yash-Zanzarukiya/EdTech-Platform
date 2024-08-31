import { StatusCodes } from 'http-status-codes';
import { Topic } from '../models/index.js';
import { asyncHandler, handleResponse } from '../utils/index.js';

const getAllTopics = asyncHandler(async (_, res) => {
    const topics = await Topic.find({});
    handleResponse(res, StatusCodes.OK, topics, 'Topics fetched successfully');
});

// create topics from string
export const getTopics = async (topicsString) => {
    let topics = [];
    let topicIds = [];

    if (!topicsString?.trim()) return { topics, topicIds };

    const topicsArray = topicsString.trim().toLowerCase().split(',') || [];

    const existingTopics = await Topic.find({ name: { $in: topicsArray } });

    for (const topic of topicsArray) {
        const existingTopic = existingTopics.find(
            (t) => t.name === topic.toLowerCase()
        );

        if (existingTopic) {
            topics.push(existingTopic);
        } else {
            topics.push(await Topic.create({ name: topic }));
        }
    }

    topicIds = topics.map((topic) => topic._id);

    return { topics, topicIds };
};

export default { getAllTopics };
