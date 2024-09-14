import { StatusCodes } from 'http-status-codes';
import { Goal } from '../models/goal.models.js';
import {
    ApiError,
    asyncHandler,
    handleResponse,
    validateFields,
    validateIds,
} from '../utils/index.js';
import topicList from './topicList.js';
import { getTopics } from './topic.controller.js';
import mongoose from 'mongoose';

const createGoal = asyncHandler(async (req, res) => {
    const { name, topics, startDate, endDate } = req.body;
    console.log({ name, topics, startDate, endDate });

    validateFields(req, ['name', 'topics']);

    const goal = new Goal({
        name,
        startDate: startDate || Date.now(),
        endDate: endDate || Date.now(),
        user: req.user?._id,
    });

    await goal.save();

    const { topicIds } = await getTopics(topics);
    await topicList.saveGoalTopics(goal._id, topicIds);

    return handleResponse(
        res,
        StatusCodes.CREATED,
        goal,
        'Goal Created Successfully'
    );
});

const updateGoal = asyncHandler(async (req, res) => {
    const { name, topics, startDate, endDate } = req.body;
    const { goalId } = req.params;

    console.log({ name, topics, startDate, endDate });

    const goal = await Goal.findById(goalId);

    if (!goal) throw new ApiError(StatusCodes.NOT_FOUND, 'Goal Not Found');

    goal.name = name ?? goal.name;
    goal.startDate = startDate ?? goal.startDate;
    goal.endDate = endDate ?? goal.endDate;

    await goal.save();

    const { topics: updatedTopics, topicIds } = await getTopics(topics);
    await topicList.saveGoalTopics(goal._id, topicIds);

    return handleResponse(
        res,
        StatusCodes.OK,
        { ...goal._doc, topics: updatedTopics },
        'Goal Updated Successfully'
    );
});

const deleteGoal = asyncHandler(async (req, res) => {
    const { goalId } = req.params;

    validateIds(goalId);

    const goal = await Goal.findById(goalId);

    if (!goal) throw new ApiError(StatusCodes.NOT_FOUND, 'Goal Not Found');

    const deletedGoal = await Goal.findByIdAndDelete(goalId);

    await topicList.saveGoalTopics(goalId, []);

    return handleResponse(
        res,
        StatusCodes.OK,
        deletedGoal,
        'Goal Deleted Successfully'
    );
});

const getUserGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.aggregate([
        {
            $match: {
                user: req.user?._id,
            },
        },
        {
            $lookup: {
                from: 'topiclists',
                localField: '_id',
                foreignField: 'goal',
                as: 'topics',
                pipeline: [
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
                ],
            },
        },
    ]);

    return handleResponse(
        res,
        StatusCodes.OK,
        goals,
        'Goals Fetched Successfully'
    );
});

const getGoalById = asyncHandler(async (req, res) => {
    const { goalId } = req.params;

    const goals = await Goal.aggregate([
        {
            $match: {
                user: req.user?._id,
                _id: new mongoose.Types.ObjectId(goalId),
            },
        },
        {
            $lookup: {
                from: 'topiclists',
                localField: '_id',
                foreignField: 'goal',
                as: 'topics',
                pipeline: [
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
                ],
            },
        },
    ]);

    return handleResponse(
        res,
        StatusCodes.OK,
        goals,
        'Goals Fetched Successfully'
    );
});

export default {
    createGoal,
    getUserGoals,
    updateGoal,
    deleteGoal,
    getGoalById,
};
