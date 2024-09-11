import mongoose from 'mongoose';
import { Course, Progress } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    validateIds,
} from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { SECTION_STATUS, VIDEO_STATUS } from '../constants.js';

const toggleProgressStatus = asyncHandler(async (req, res) => {
    const { courseId, videoId } = req.params;

    validateIds(courseId, videoId);

    const isProgress = await Progress.findOne({
        user: req.user?._id,
        course: courseId,
        video: videoId,
    });

    if (!isProgress) {
        const newProgress = await Progress.create({
            user: req.user?._id,
            course: courseId,
            video: videoId,
        });
        if (!newProgress)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An Error occurred while saving progress'
            );
    } else {
        const deletedProgress = await Progress.findByIdAndDelete(
            isProgress._id
        );
        if (!deletedProgress)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An Error occurred while deleting progress'
            );
    }

    handleResponse(
        res,
        StatusCodes.OK,
        { progress: isProgress ? 0 : 100, videoId, courseId },
        'Progress Saved successfully'
    );
});

const getUserProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const allProgress = await Progress.find({
        user: req.user?._id,
        course: courseId,
    });

    const course = await Course.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $lookup: {
                from: 'coursesections',
                localField: '_id',
                foreignField: 'course',
                as: 'sections',
                pipeline: [
                    {
                        $lookup: {
                            from: 'sections',
                            localField: 'section',
                            foreignField: '_id',
                            as: 'sections',
                            pipeline: [
                                {
                                    $match: {
                                        status: SECTION_STATUS.PUBLISHED,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'sectioncontents',
                                        localField: '_id',
                                        foreignField: 'section',
                                        as: 'videos',
                                        pipeline: [
                                            {
                                                $lookup: {
                                                    from: 'videos',
                                                    localField: 'video',
                                                    foreignField: '_id',
                                                    as: 'videos',
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                status: {
                                                                    $ne: VIDEO_STATUS.UNPUBLISHED,
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    $addFields: {
                                        totalVideos: {
                                            $size: '$videos',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $sum: '$sections.totalVideos',
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
            },
        },
    ]);

    const progressData = {
        totalVideos: course.totalVideos,
        allProgress: allProgress.length,
    };

    handleResponse(
        res,
        StatusCodes.OK,
        progressData,
        'Progress Saved successfully'
    );
});

export default { toggleProgressStatus, getUserProgress };
