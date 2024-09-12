import mongoose from 'mongoose';
import {
    CourseSections,
    Section,
    SectionContent,
    Video,
} from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    validateFields,
    validateIds,
    checkOneField,
} from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { VIDEO_STATUS } from '../constants.js';
import { videoController } from './index.js';

const createSection = asyncHandler(async (req, res) => {
    const { name, order = 1 } = req.body;
    const { courseId } = req.params;

    validateFields(req, { body: ['name'] });
    validateIds(courseId);

    const section = await Section.create({
        name,
        course: courseId,
    });

    await CourseSections.create({
        section: section._id,
        course: courseId,
        order,
    });

    if (!section)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while creating section'
        );

    handleResponse(
        res,
        StatusCodes.CREATED,
        section,
        'Section Created Successfully'
    );
});

const updateSection = asyncHandler(async (req, res) => {
    const { name, status } = req.body;
    const { sectionId } = req.params;

    checkOneField(req, ['name', 'status']);
    validateIds(sectionId);

    const section = await Section.findById(sectionId);

    if (!section)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Section Not Found');

    if (name) section.name = name;
    if (status) section.status = status;

    const updatedSection = await section.save();

    if (!updatedSection)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while updating section'
        );

    handleResponse(
        res,
        StatusCodes.CREATED,
        {
            _id: updatedSection._id,
            name: updatedSection.name,
            status: updatedSection.status,
        },
        'Section Updated Successfully'
    );
});

const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    const deletedSection = await deleteOneSection(sectionId);

    handleResponse(
        res,
        StatusCodes.OK,
        deletedSection,
        'Section deleted successfully'
    );
});

const deleteOneSection = async (sectionId) => {
    validateIds(sectionId);

    const deletedSection = await Section.findByIdAndDelete(sectionId);

    if (!deletedSection)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Section not found');

    await CourseSections.findOneAndDelete({ section: deletedSection._id });

    // delete all videos in the section
    const videos = await SectionContent.deleteMany({
        section: deletedSection._id,
        video: { $exists: true },
    });

    if (videos.length) {
        for (let j = 0; j < videos.length; j++) {
            await videoController.deleteOneVideo(videos[j].video, {
                status: { $ne: VIDEO_STATUS.PUBLIC },
            });
        }
    }

    return deletedSection;
};

const deleteManySections = async (sectionIds = []) => {
    if (!sectionIds.length) return;
    console.log({ sectionIds });

    const deletedSections = await Section.find({
        _id: { $in: sectionIds },
    });

    await Section.deleteMany({
        _id: { $in: sectionIds },
    });

    console.log({ deletedSections });

    if (deletedSections.length) {
        const sectionVideos = await SectionContent.find({
            section: { $in: sectionIds },
            video: { $exists: true },
        });

        console.log({ sectionVideos });

        const videoIds = sectionVideos.map((video) => video.video) || [];

        await videoController.deleteManyVideos(videoIds, {
            status: { $ne: VIDEO_STATUS.PUBLIC },
        });

        const publicVideos = await Video.find({
            _id: { $in: videoIds },
            status: VIDEO_STATUS.PUBLIC,
        });

        console.log({ publicVideos });

        if (publicVideos.length) {
            for (let j = 0; j < publicVideos.length; j++) {
                await SectionContent.findOneAndDelete({
                    video: publicVideos[j]._id,
                });

                publicVideos[j].section = null;
                await publicVideos[j].save();
            }
        }
    }

    return deletedSections;
};

// NOT USED
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
// NOT USED
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

export default {
    createSection,
    updateSection,
    getCourseSections,
    getSectionById,
    deleteSection,
    deleteOneSection,
    deleteManySections,
};
