import { StatusCodes } from 'http-status-codes';
import { Topic } from '../models/index.js';
import { asyncHandler, handleResponse } from '../utils/index.js';

const getAllTopics = asyncHandler(async (_, res) => {
    const topics = await Topic.find({});
    handleResponse(res, StatusCodes.OK, topics, 'Topics fetched successfully');
});

// create topics
const createTopics = asyncHandler(async (req, res) => {
    const { topics } = req.body;
    const createdTopics = [];

    topics.map(async (topic) => {
        createdTopics.push(await Topic.create({ name: topic }));
    });

    handleResponse(
        res,
        StatusCodes.CREATED,
        createdTopics,
        'Topics created successfully'
    );
});

export default { getAllTopics, createTopics };
