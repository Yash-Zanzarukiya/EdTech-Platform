import mongoose from 'mongoose';
import { TopicList } from '../models/index.js';
import { validateIds } from '../utils/index.js';

const saveVideoTopics = async (videoId, topicIds = []) => {
    validateIds(videoId);

    // find if the video already has topics
    // or else create a new one and
    // delete the topics that are not in the list

    await TopicList.deleteMany({ video: videoId, topic: { $nin: topicIds } });

    if (!topicIds.length) return true;

    const videoTopics = await TopicList.find({ video: videoId });

    for (const topic of topicIds) {
        const existingTopic = videoTopics.find(
            (t) => t.topic.toString() === topic.toString()
        );

        if (!existingTopic) {
            await TopicList.create({ video: videoId, topic });
        }
    }

    return true;
};

const saveCourseTopics = async (courseId, topicIds = []) => {
    validateIds(courseId);

    // find if the course already has topics or else create a new one and delete the topics that are not in the list

    await TopicList.deleteMany({ course: courseId, topic: { $nin: topicIds } });

    if (!topicIds.length) return true;

    const courseTopics = await TopicList.find({ course: courseId });

    for (const topic of topicIds) {
        const existingTopic = courseTopics.find(
            (t) => t.topic.toString() === topic.toString()
        );

        if (!existingTopic) {
            await TopicList.create({ course: courseId, topic });
        }
    }

    return true;
};

const saveGoalTopics = async (goalId, topicIds = []) => {
    validateIds(goalId);

    // find if the goal already has topics or else create a new one and delete the topics that are not in the list

    await TopicList.deleteMany({ goal: goalId, topic: { $nin: topicIds } });

    if (!topicIds.length) return true;

    const goalTopics = await TopicList.find({ goal: goalId });

    for (const topic of topicIds) {
        const existingTopic = goalTopics.find(
            (t) => t.topic.toString() === topic.toString()
        );

        if (!existingTopic) {
            await TopicList.create({ goal: goalId, topic });
        }
    }

    return true;
};

const getCourseTopics = async (courseId) => {
    const topics = await TopicList.aggregate([
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $lookup: {
                from: 'topics',
                localField: 'topic',
                foreignField: '_id',
                as: 'topic',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$topic',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: '$topic._id',
                name: '$topic.name',
            },
        },
    ]);

    const topicIds = topics.length ? topics.map((topic) => topic._id) : [];

    return { topics, topicIds };
};

const getVideoTopics = async (videoId) => {
    const topics = await TopicList.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: 'topics',
                localField: 'topic',
                foreignField: '_id',
                as: 'topic',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$topic',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: '$topic._id',
                name: '$topic.name',
            },
        },
    ]);

    const topicIds =
        (topics.length > 0 && topics[0].map((topic) => topic._id)) || [];

    return { topics, topicIds };
};

const getGoalTopics = async (goalId) => {
    const topics = await TopicList.aggregate([
        {
            $match: {
                goal: new mongoose.Types.ObjectId(goalId),
            },
        },
        {
            $lookup: {
                from: 'topics',
                localField: 'topic',
                foreignField: '_id',
                as: 'topic',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$topic',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: '$topic._id',
                name: '$topic.name',
            },
        },
    ]);

    const topicIds =
        (topics.length > 0 && topics[0].map((topic) => topic._id)) || [];

    return { topics, topicIds };
};

export default {
    saveVideoTopics,
    saveCourseTopics,
    saveGoalTopics,
    getCourseTopics,
    getVideoTopics,
    getGoalTopics,
};
