import mongoose from 'mongoose';
import { Course, Section, Video } from '../models/index.js';
import {
    asyncHandler,
    ApiError,
    handleResponse,
    validateFields,
    validateIds,
} from '../utils/index.js';
import { cloudinary } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { getTopics } from './topic.controller.js';
import {
    COURSE_STATUS,
    GET_COURSE_TYPE,
    SECTION_STATUS,
    VIDEO_STATUS,
} from '../constants.js';

const createCourse = asyncHandler(async (req, res) => {
    const { name, description, price, duration } = req.body;

    validateFields(req, { body: ['name', 'description', 'price', 'duration'] });

    const photoLocalPath = req.file?.path;

    if (!photoLocalPath)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Thumbnail file required');

    const photo = await cloudinary.uploadPhotoOnCloudinary(photoLocalPath);

    if (!photo)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error Occurred While uploading thumbnail file'
        );

    const course = await Course.create({
        name,
        description,
        thumbnail: photo.url,
        price: parseInt(price),
        duration: parseInt(duration),
        owner: req.user?._id,
    });

    if (!course)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while creating Course'
        );

    handleResponse(
        res,
        StatusCodes.CREATED,
        course,
        'Course Created Successfully'
    );
});

// TODO : Complete it
const getCourses = asyncHandler(async (req, res) => {
    const {
        courseId,
        ownerId,
        status,
        search = '',
        type = GET_COURSE_TYPE.PREVIEW,
    } = req.query;

    const matchStage = {};

    if (courseId) {
        validateIds(courseId);
        matchStage._id = new mongoose.Types.ObjectId(courseId);
    }

    if (ownerId) {
        validateIds(ownerId);
        matchStage.owner = new mongoose.Types.ObjectId(ownerId);
    }

    if (status) matchStage.status = status;

    if (search) matchStage.name = { $regex: search, $options: 'i' };

    const pipeline = [];

    // Add filters
    pipeline.push({ $match: { ...matchStage } });

    // Fetch Course Topics
    if (type !== GET_COURSE_TYPE.INSTRUCTOR_LIST) {
        pipeline.push({
            $lookup: {
                from: 'topics',
                localField: 'topics',
                foreignField: '_id',
                as: 'topics',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                        },
                    },
                ],
            },
        });
    }

    // Fetch Sections and Videos and video Topics
    if (type === GET_COURSE_TYPE.CURRICULUM) {
        pipeline.push({
            $lookup: {
                from: 'sections',
                localField: '_id',
                foreignField: 'course',
                as: 'sections',
                pipeline: [
                    {
                        $lookup: {
                            from: 'videos',
                            localField: 'videos.video',
                            foreignField: '_id',
                            as: 'videos',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'topics',
                                        localField: 'topics',
                                        foreignField: '_id',
                                        as: 'topics',
                                        pipeline: [
                                            {
                                                $project: {
                                                    name: 1,
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        });
    }

    // Fetch Owner Details
    if (
        type !== GET_COURSE_TYPE.INSTRUCTOR_LIST &&
        type !== GET_COURSE_TYPE.CURRICULUM
    ) {
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1,
                                email: 1,
                                bio: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: '$owner' }
        );
    }

    const course = await Course.aggregate(pipeline);

    handleResponse(
        res,
        StatusCodes.OK,
        courseId ? course[0] : course,
        'Courses sent successfully'
    );
});

const getInstructorCourses = asyncHandler(async (req, res) => {
    const { courseId } = req.query;

    const matchStage = {};

    if (courseId) {
        validateIds(courseId);
        matchStage._id = new mongoose.Types.ObjectId(courseId);
    }

    const pipeline = [];

    // Add filters
    pipeline.push({ $match: { ...matchStage } });

    // Fetch Course Topics, Sections and videos and it's topics
    if (courseId) {
        pipeline.push(
            {
                $lookup: {
                    from: 'topics',
                    localField: 'topics',
                    foreignField: '_id',
                    as: 'topics',
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
                $lookup: {
                    from: 'sections',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'sections',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'videos',
                                localField: 'videos.video',
                                foreignField: '_id',
                                as: 'videos',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: 'topics',
                                            localField: 'topics',
                                            foreignField: '_id',
                                            as: 'topics',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        name: 1,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            }
        );
    }

    // Fetch Owner Details
    if (courseId) {
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1,
                                email: 1,
                                bio: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: '$owner' }
        );
    }

    const courses = await Course.aggregate(pipeline);

    handleResponse(
        res,
        StatusCodes.OK,
        courseId ? courses[0] : courses,
        'Course Details sent successfully'
    );
});

const getLearnerCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.query;
    validateIds(courseId);

    const matchStage = { _id: new mongoose.Types.ObjectId(courseId) };

    matchStage.status = COURSE_STATUS.PUBLISHED;

    const course = await Course.aggregate([
        {
            $match: { ...matchStage },
        },
        // Fetch Topics
        {
            $lookup: {
                from: 'topics',
                localField: 'topics',
                foreignField: '_id',
                as: 'topics',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                        },
                    },
                ],
            },
        },
        // Fetch Sections which are published and has at-least one video and Videos
        {
            $lookup: {
                from: 'sections',
                localField: '_id',
                foreignField: 'course',
                as: 'sections',
                pipeline: [
                    {
                        $match: {
                            status: SECTION_STATUS.PUBLISHED,
                            videos: { $exists: true, $ne: [] },
                        },
                    },
                    {
                        $lookup: {
                            from: 'videos',
                            localField: 'videos.video',
                            foreignField: '_id',
                            as: 'videos',
                            pipeline: [
                                // check status is not unpublished
                                {
                                    $match: {
                                        status: {
                                            $ne: VIDEO_STATUS.UNPUBLISHED,
                                        },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'topics',
                                        localField: 'topics',
                                        foreignField: '_id',
                                        as: 'topics',
                                        pipeline: [
                                            {
                                                $project: {
                                                    name: 1,
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $match: {
                            videos: { $exists: true, $ne: [] },
                        },
                    },
                    // Add Section total duration
                    {
                        $addFields: {
                            totalDuration: {
                                $sum: '$videos.duration',
                            },
                        },
                    },
                ],
            },
        },
        // Fetch Owner Details
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            email: 1,
                            bio: 1,
                        },
                    },
                ],
            },
        },
        { $unwind: '$owner' },
    ]);

    if (!course || course.length === 0)
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Course not found or Published'
        );

    handleResponse(res, StatusCodes.OK, course[0], 'Course sent successfully');
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const course = await Course.findByIdAndDelete(courseId);

    if (!course)
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Course not found or already deleted'
        );

    await cloudinary.deleteImageOnCloudinary(course.thumbnail);

    // TODO: delete quizzes, progress, purchase of the course

    const sections = await Section.find({ course: courseId });

    if (sections?.length > 0) {
        for (let i = 0; i < sections.length; i++) {
            const section = await Section.findByIdAndDelete(sections[i]._id);

            const videos = section?.videos;

            if (videos?.length > 0) {
                for (let j = 0; j < videos.length; j++) {
                    // delete video if it's status is not public
                    const video = await Video.findOneAndDelete({
                        _id: videos[j].video,
                        status: { $ne: VIDEO_STATUS.PUBLIC },
                    });
                    // delete video from cloudinary
                    if (video) {
                        await cloudinary.deleteVideoOnCloudinary(
                            video.videoFile
                        );
                        await cloudinary.deleteImageOnCloudinary(
                            video.thumbnail
                        );
                    }
                }
            }
        }
    }

    handleResponse(res, StatusCodes.OK, course, 'Course deleted successfully');
});

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { name, description, price, duration, status, topics } = req.body;

    validateIds(courseId);

    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found');

    const photoLocalPath = req.file?.path;

    if (photoLocalPath) {
        await cloudinary.deleteImageOnCloudinary(course.thumbnail);

        const photo = await cloudinary.uploadPhotoOnCloudinary(photoLocalPath);

        if (!photo)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Something went wrong While uploading thumbnail file'
            );

        course.thumbnail = photo.url;
    }

    const topicsArray = await getTopics(topics?.trim(), courseId);

    if (topics) {
        course.topics = topicsArray.map((topic) => topic._id);
    }

    course.name = name ?? course.name;
    course.description = description ?? course.description;
    course.price = price ? parseInt(price) : course.price;
    course.duration = duration ? parseInt(duration) : course.duration;
    course.status = status ?? course.status;

    const updatedCourse = await course.save();

    if (!updatedCourse)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while updating course'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        { ...updatedCourse._doc, topics: topicsArray },
        'Course updated successfully'
    );
});

const updateCourseStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { status } = req.body;

    validateFields(req, { body: ['status'] });
    validateIds(courseId);

    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found');

    course.status = status;

    const updatedCourse = await course.save();

    if (!updatedCourse)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while updating course'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        { _id: updatedCourse._id, status: updatedCourse.status },
        'Course updated successfully'
    );
});

export default {
    createCourse,
    deleteCourse,
    getCourses,
    getLearnerCourse,
    getInstructorCourses,
    updateCourse,
    updateCourseStatus,
};
