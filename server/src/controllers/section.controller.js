import mongoose from 'mongoose';
import { Section } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    validateFields,
    validateIds,
} from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';

// TODO: modify according to section model

const createSection = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { courseId } = req.params;

    validateFields(req, { body: ['name'] });
    validateIds(courseId);

    const section = await Section.create({
        name,
        course: courseId,
        owner: req.user?._id,
    });

    if (!section)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error occurred while creating section'
        );

    handleResponse(
        res,
        StatusCodes.CREATED,
        section,
        'Section Created Successfully'
    );
});

const getCourseSections = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const sections = await Section.aggregate([
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'videos',
                foreignField: '_id',
                as: 'videos',
                pipeline: [
                    {
                        $lookup: {
                            from: 'progresses',
                            localField: '_id',
                            foreignField: 'video',
                            as: 'isCompleted',
                        },
                    },
                    {
                        $addFields: {
                            isCompleted: {
                                $ne: [{ $size: '$isCompleted' }, 0],
                            },
                        },
                    },
                ],
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, sections, 'Sections sent successfully');
});

const getSectionById = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    validateIds(sectionId);

    const section = await Section.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(sectionId),
            },
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'videos',
                foreignField: '_id',
                as: 'videos',
                pipeline: [
                    {
                        $lookup: {
                            from: 'progresses',
                            localField: '_id',
                            foreignField: 'video',
                            as: 'isCompleted',
                        },
                    },
                    {
                        $addFields: {
                            isCompleted: {
                                $ne: [{ $size: '$isCompleted' }, 0],
                            },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                name: 1,
                videos: 1,
                course: 1,
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, section, 'Section sent successfully');
});

const addVideoToSection = asyncHandler(async (req, res) => {
    const { sectionId, videoId } = req.params;

    validateIds(sectionId, videoId);

    const section = await Section.findByIdAndUpdate(
        sectionId,
        {
            $addToSet: {
                videos: videoId,
            },
        },
        {
            new: true,
        }
    );

    if (!section)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while adding video to section'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        section,
        'Video added to section successfully'
    );
});

const removeVideoFromSection = asyncHandler(async (req, res) => {
    const { sectionId, videoId } = req.params;

    validateIds(sectionId, videoId);

    const section = await Section.findByIdAndUpdate(
        sectionId,
        {
            $pull: {
                videos: videoId,
            },
        },
        {
            new: true,
        }
    );

    if (!section)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error occurred while removing video from section'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        section,
        'Video removed from section successfully'
    );
});

const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    validateIds(sectionId);

    const section = await Section.findByIdAndDelete(sectionId);

    if (!section)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while deleting section'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        { isDeleted: true },
        'section deleted successfully'
    );
});

export default {
    createSection,
    getCourseSections,
    getSectionById,
    addVideoToSection,
    removeVideoFromSection,
    deleteSection,
};
