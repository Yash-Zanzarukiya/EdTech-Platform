import mongoose from 'mongoose';
import {
    asyncHandler,
    ApiError,
    handleResponse,
    validateFields,
    validateIds,
} from '../utils/index.js';
import { sectionContent, sectionController, topicList } from './index.js';
import { cloudinary } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { getTopics } from './topic.controller.js';
import {
    Course,
    CourseSections,
    Section,
    Transcript,
    Video,
} from '../models/index.js';
import { COURSE_STATUS, SECTION_STATUS, VIDEO_STATUS } from '../constants.js';
import { getPlaylistWithContent } from '../utils/fetchYouTubeVideos.js';

const createCourse = asyncHandler(async (req, res) => {
    const { name, description = '', price } = req.body;

    validateFields(req, { body: ['name', 'price'] });

    const photoLocalPath = req.file?.path;

    if (!photoLocalPath)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Thumbnail file required');

    const photo = await cloudinary.uploadPhotoOnCloudinary(photoLocalPath);

    if (!photo)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong While uploading thumbnail file'
        );

    const course = await Course.create({
        name,
        description,
        thumbnail: photo.url,
        price: parseInt(price),
        owner: req.user?._id,
    });

    if (!course)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while creating Course'
        );

    handleResponse(
        res,
        StatusCodes.CREATED,
        course,
        'Course Created Successfully'
    );
});

const fetchCourseTopics = {
    $lookup: {
        from: 'topiclists',
        localField: '_id',
        foreignField: 'course',
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
};

const getCourses = asyncHandler(async (req, res) => {
    const {
        courseId,
        ownerId,
        status = COURSE_STATUS.PUBLISHED,
        search = '',
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
    pipeline.push(fetchCourseTopics);

    // Fetch Course Duration and remove empty courses
    pipeline.push(
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
                            as: 'section',
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
                                                    as: 'video',
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
                                            {
                                                $match: {
                                                    video: {
                                                        $exists: true,
                                                        $ne: [],
                                                    },
                                                },
                                            },
                                            {
                                                $replaceRoot: {
                                                    newRoot: {
                                                        $first: '$video',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    $match: {
                                        videos: {
                                            $exists: true,
                                            $ne: [],
                                        },
                                    },
                                },
                                // Add Section total duration
                                {
                                    $addFields: {
                                        totalDuration: {
                                            $sum: '$videos.duration',
                                        },
                                        totalVideos: {
                                            $size: '$videos',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    // remove empty sections
                    {
                        $match: {
                            section: {
                                $exists: true,
                                $ne: [],
                            },
                        },
                    },
                    {
                        $replaceRoot: {
                            newRoot: { $first: '$section' },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                totalDuration: {
                    $sum: '$sections.totalDuration',
                },
                totalVideos: {
                    $sum: '$sections.totalVideos',
                },
            },
        },
        {
            $match: {
                totalVideos: { $gt: 0 },
            },
        }
    );

    // Fetch Owner Details
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

    pipeline.push({
        $project: {
            name: 1,
            description: 1,
            thumbnail: 1,
            price: 1,
            totalDuration: 1,
            totalVideos: 1,
            topics: 1,
            owner: 1,
            createdAt: 1,
            updatedAt: 1,
        },
    });

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

    const matchStage = { owner: req.user?._id };

    if (courseId) {
        validateIds(courseId);
        matchStage._id = new mongoose.Types.ObjectId(courseId);
    }

    const pipeline = [];

    // Add filters
    pipeline.push({ $match: { ...matchStage } });

    // Fetch Course Topics, Course Sections and videos and it's topics
    if (courseId) {
        pipeline.push(fetchCourseTopics);

        pipeline.push({
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
                            as: 'section',
                            pipeline: [
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
                                                    as: 'video',
                                                    pipeline: [
                                                        {
                                                            $lookup: {
                                                                from: 'topiclists',
                                                                localField:
                                                                    '_id',
                                                                foreignField:
                                                                    'video',
                                                                as: 'topics',
                                                                pipeline: [
                                                                    {
                                                                        $lookup:
                                                                            {
                                                                                from: 'topics',
                                                                                localField:
                                                                                    'topic',
                                                                                foreignField:
                                                                                    '_id',
                                                                                as: 'topic',
                                                                            },
                                                                    },

                                                                    {
                                                                        $replaceRoot:
                                                                            {
                                                                                newRoot:
                                                                                    {
                                                                                        $first: '$topic',
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
                                                $replaceRoot: {
                                                    newRoot: {
                                                        $first: '$video',
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
                        $replaceRoot: {
                            newRoot: { $first: '$section' },
                        },
                    },
                ],
            },
        });
    }

    const courses = await Course.aggregate(pipeline);

    handleResponse(
        res,
        StatusCodes.OK,
        courseId ? courses[0] : courses,
        'Course(s) Details sent successfully'
    );
});

const getLearnerCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.query;
    validateIds(courseId);

    const course = await Course.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
                status: COURSE_STATUS.PUBLISHED,
            },
        },
        {
            $lookup: {
                from: 'topiclists',
                localField: '_id',
                foreignField: 'course',
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
        // Fetch Sections which are published and has at-least one video and Videos with progress
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
                            as: 'section',
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
                                                    as: 'video',
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                status: {
                                                                    $ne: VIDEO_STATUS.UNPUBLISHED,
                                                                },
                                                            },
                                                        },
                                                        {
                                                            $lookup: {
                                                                from: 'topiclists',
                                                                localField:
                                                                    '_id',
                                                                foreignField:
                                                                    'video',
                                                                as: 'topics',
                                                                pipeline: [
                                                                    {
                                                                        $lookup:
                                                                            {
                                                                                from: 'topics',
                                                                                localField:
                                                                                    'topic',
                                                                                foreignField:
                                                                                    '_id',
                                                                                as: 'topic',
                                                                            },
                                                                    },
                                                                    {
                                                                        $replaceRoot:
                                                                            {
                                                                                newRoot:
                                                                                    {
                                                                                        $first: '$topic',
                                                                                    },
                                                                            },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            $lookup: {
                                                                from: 'progresses',
                                                                localField:
                                                                    '_id',
                                                                foreignField:
                                                                    'video',
                                                                as: 'progress',
                                                                pipeline: [
                                                                    {
                                                                        $match: {
                                                                            user: req
                                                                                .user
                                                                                ?._id,
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            $addFields: {
                                                                progress: {
                                                                    $cond: {
                                                                        if: {
                                                                            $eq: [
                                                                                {
                                                                                    $size: '$progress',
                                                                                },
                                                                                0,
                                                                            ],
                                                                        },
                                                                        then: 0,
                                                                        else: 100,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                $match: {
                                                    video: {
                                                        $exists: true,
                                                        $ne: [],
                                                    },
                                                },
                                            },
                                            {
                                                $replaceRoot: {
                                                    newRoot: {
                                                        $first: '$video',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    $match: {
                                        videos: {
                                            $exists: true,
                                            $ne: [],
                                        },
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
                                // count completed videos
                                {
                                    $addFields: {
                                        completedVideos: {
                                            $size: {
                                                $filter: {
                                                    input: '$videos',
                                                    as: 'video',
                                                    cond: {
                                                        $eq: [
                                                            '$$video.progress',
                                                            100,
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    // remove empty sections
                    {
                        $match: {
                            section: {
                                $exists: true,
                                $ne: [],
                            },
                        },
                    },
                    {
                        $replaceRoot: {
                            newRoot: { $first: '$section' },
                        },
                    },
                ],
            },
        },
        // add total videos and completed videos of course
        {
            $addFields: {
                // sum of section -> videos[]
                totalVideos: {
                    $sum: {
                        $map: {
                            input: '$sections',
                            as: 'section',
                            in: {
                                $size: '$$section.videos',
                            },
                        },
                    },
                },
                completedVideos: {
                    $sum: '$sections.completedVideos',
                },
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

// TODO: Delete purchase of the course
const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    validateIds(courseId);

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse)
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Course not found or already deleted'
        );

    await topicList.saveCourseTopics(deletedCourse._id, []);
    await cloudinary.deleteImageOnCloudinary(deletedCourse.thumbnail);

    const sections = await CourseSections.find({ course: deletedCourse._id });

    if (sections.length) {
        const sectionIds = sections.map((s) => s.section);
        await sectionController.deleteManySections(sectionIds);
    }

    console.log(`Course (${deletedCourse.name}) deleted successfully`);

    handleResponse(
        res,
        StatusCodes.OK,
        deletedCourse,
        'Course deleted successfully'
    );
});

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { name, description, price, status, topics, hasExam } = req.body;

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

    let updatedCourse = course;
    let topicsArray = [];

    if (typeof topics === 'string') {
        const { topics: allTopics, topicIds } = await getTopics(topics);
        await topicList.saveCourseTopics(courseId, topicIds);
        topicsArray = allTopics;
    } else {
        course.name = name ?? course.name;
        course.description = description ?? course.description;
        course.price = price ? parseInt(price) : course.price;
        course.status = status ?? course.status;
        course.hasExam = hasExam ?? course.hasExam;

        updatedCourse = await course.save();

        if (!updatedCourse)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Something went wrong while updating course'
            );

        const courseTopics = await topicList.getCourseTopics(courseId);
        topicsArray = courseTopics.topics;
    }

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

const addYTPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, courseTopics = '', videoTopics = '' } = req.body;

    validateFields(req, { body: ['playlistId'] });

    console.log('Creating Course...');
    const { playlistDetails, videos } =
        await getPlaylistWithContent(playlistId);

    const course = await Course.create({
        name: playlistDetails.title,
        description: playlistDetails.description,
        thumbnail: playlistDetails.thumbnail,
        price: 99,
        owner: req.user?._id,
        status: COURSE_STATUS.PUBLISHED,
    });

    if (!course)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while creating Course'
        );

    const { topicIds: courseTopicIds } = await getTopics(courseTopics);
    await topicList.saveCourseTopics(course._id, courseTopicIds);

    const { topicIds: videoTopicIds } = await getTopics(videoTopics);

    let sectionId = '';
    let createdVideos = [];

    for (let i = 0; i < videos.length; i++) {
        if (i % 5 === 0) {
            const newSection = await Section.create({
                name: `Section ${Math.floor(i / 5) + 1}`,
                course: course._id,
            });

            if (!newSection)
                throw new ApiError(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Something went wrong while creating Section'
                );

            await CourseSections.create({
                course: course._id,
                section: newSection._id,
            });

            sectionId = newSection._id;
        }

        const {
            title,
            videoFile,
            thumbnail,
            duration,
            description,
            transcript,
        } = videos[i];

        const video = await Video.create({
            videoFile,
            title,
            description,
            thumbnail,
            duration,
            section: sectionId,
            owner:
                req.user?._id ||
                new mongoose.Types.ObjectId('66b5a6c2cd3c10208dfc5289'),
        });

        if (!video) continue;

        createdVideos.push(video);

        await Transcript.create({ video: video._id, transcript });

        await topicList.saveVideoTopics(video._id, videoTopicIds);

        if (sectionId) {
            await sectionContent.toggleVideoToSectionContent(
                sectionId,
                video._id
            );
        }
        console.log(`Saved video ${i + 1} out of ${videos.length}`);
    }

    console.log(`Course (${course.name}) saved successfully`);

    handleResponse(res, StatusCodes.OK, course, 'Course updated successfully');
});

export default {
    createCourse,
    deleteCourse,
    getCourses,
    getLearnerCourse,
    getInstructorCourses,
    updateCourse,
    updateCourseStatus,
    addYTPlaylist,
};
