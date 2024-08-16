import mongoose from 'mongoose';
import { Section, Video } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    validateFields,
    validateIds,
    cloudinary,
} from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { VIDEO_STATUS } from '../constants.js';

const createSection = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { courseId } = req.params;

    validateFields(req, { body: ['name'] });
    validateIds(courseId);

    const section = await Section.create({
        name,
        course: courseId,
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

const updateSection = asyncHandler(async (req, res) => {
    const { name, order, status } = req.body;
    const { sectionId } = req.params;

    validateIds(sectionId);

    const section = await Section.findById(sectionId);

    if (!section)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Section Not Found');

    section.name = name || section.name;
    section.order = order || section.order;
    section.status = status || section.status;

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
            order: updatedSection.order,
            status: updatedSection.status,
        },
        'Section Updated Successfully'
    );
});

export const toggleVideoToSection = async (
    sectionId,
    videoId,
    toggle = true
) => {
    validateIds(videoId);

    if (sectionId) {
        const section = toggle
            ? await Section.findByIdAndUpdate(
                  sectionId,
                  {
                      $addToSet: {
                          videos: { video: videoId },
                      },
                  },
                  {
                      new: true,
                  }
              )
            : await Section.findByIdAndUpdate(
                  sectionId,
                  {
                      $pull: {
                          videos: { video: videoId },
                      },
                  },
                  {
                      new: true,
                  }
              );
        if (!section)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An Error Occurred while toggling video'
            );
    } else {
        await Section.findOneAndUpdate(
            {
                videos: {
                    $elemMatch: { video: videoId },
                },
            },
            {
                $pull: {
                    videos: { video: videoId },
                },
            },
            {
                new: true,
            }
        );
    }

    return true;
};

const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    validateIds(sectionId);

    const section = await Section.findByIdAndDelete(sectionId);

    if (!section)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while deleting section'
        );

    const videos = section.videos;

    if (videos?.length > 0) {
        for (let j = 0; j < videos.length; j++) {
            // delete video if it's status is not public
            const video = await Video.findOneAndDelete({
                _id: videos[j].video,
                status: { $ne: VIDEO_STATUS.PUBLIC },
            });
            // delete video from cloudinary
            if (video) {
                await cloudinary.deleteVideoOnCloudinary(video.videoFile);
                await cloudinary.deleteImageOnCloudinary(video.thumbnail);
            }
        }
    }

    handleResponse(
        res,
        StatusCodes.OK,
        section,
        'section deleted successfully'
    );
});

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
};
