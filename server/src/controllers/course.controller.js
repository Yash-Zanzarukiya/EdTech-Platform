import mongoose from 'mongoose';
import {
    asyncHandler,
    ApiError,
    handleResponse,
    validateFields,
    validateIds,
} from '../utils/index.js';
import { sectionController, topicList } from './index.js';
import { cloudinary } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { getTopics } from './topic.controller.js';
import { Course, CourseSections, Section, Video } from '../models/index.js';
import { COURSE_STATUS, SECTION_STATUS, VIDEO_STATUS } from '../constants.js';

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
        // Fetch Sections which are published and has at-least one video and Videos
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
        const sectionIds = sections.map((s) => s._id);
        await sectionController.deleteManySections(sectionIds);
        // for (let i = 0; i < sections.length; i++) {
        //     await sectionController.deleteOneSection(sections[i].section);
        // }
    }

    handleResponse(
        res,
        StatusCodes.OK,
        deletedCourse,
        'Course deleted successfully'
    );
});

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { name, description, price, status, topics } = req.body;

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

export default {
    createCourse,
    deleteCourse,
    getCourses,
    getLearnerCourse,
    getInstructorCourses,
    updateCourse,
    updateCourseStatus,
};

// import mongoose from 'mongoose';
// import {
//     asyncHandler,
//     ApiError,
//     handleResponse,
//     validateFields,
//     validateIds,
// } from '../utils/index.js';
// import { topicList } from './index.js';
// import { cloudinary } from '../utils/index.js';
// import { StatusCodes } from 'http-status-codes';
// import { getTopics } from './topic.controller.js';
// import { Course, Section, Video } from '../models/index.js';
// import { COURSE_STATUS, SECTION_STATUS, VIDEO_STATUS } from '../constants.js';

// const fetchCourseTopics = {
//     $lookup: {
//         from: 'topiclists',
//         localField: '_id',
//         foreignField: 'course',
//         as: 'topics',
//         pipeline: [
//             {
//                 $lookup: {
//                     from: 'topics',
//                     localField: 'topic',
//                     foreignField: '_id',
//                     as: 'topic',
//                     pipeline: [
//                         {
//                             $project: {
//                                 name: 1,
//                             },
//                         },
//                     ],
//                 },
//             },
//             {
//                 $unwind: {
//                     path: '$topic',
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $project: {
//                     _id: '$topic._id',
//                     name: '$topic.name',
//                 },
//             },
//         ],
//     },
// };

// const fetchVideoTopics = {
//     $lookup: {
//         from: 'topiclists',
//         localField: '_id',
//         foreignField: 'video',
//         as: 'topics',
//         pipeline: [
//             {
//                 $lookup: {
//                     from: 'topics',
//                     localField: 'topic',
//                     foreignField: '_id',
//                     as: 'topic',
//                     pipeline: [
//                         {
//                             $project: {
//                                 name: 1,
//                             },
//                         },
//                     ],
//                 },
//             },
//             {
//                 $unwind: {
//                     path: '$topic',
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $project: {
//                     _id: '$topic._id',
//                     name: '$topic.name',
//                 },
//             },
//         ],
//     },
// };

// const createCourse = asyncHandler(async (req, res) => {
//     const { name, description = '', price } = req.body;

//     validateFields(req, { body: ['name', 'price'] });

//     const photoLocalPath = req.file?.path;

//     if (!photoLocalPath)
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Thumbnail file required');

//     const photo = await cloudinary.uploadPhotoOnCloudinary(photoLocalPath);

//     if (!photo)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Something went wrong While uploading thumbnail file'
//         );

//     const course = await Course.create({
//         name,
//         description,
//         thumbnail: photo.url,
//         price: parseInt(price),
//         owner: req.user?._id,
//     });

//     if (!course)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Something went wrong while creating Course'
//         );

//     handleResponse(
//         res,
//         StatusCodes.CREATED,
//         course,
//         'Course Created Successfully'
//     );
// });

// const getCourses = asyncHandler(async (req, res) => {
//     const {
//         courseId,
//         ownerId,
//         status = COURSE_STATUS.PUBLISHED,
//         search = '',
//     } = req.query;

//     const matchStage = {};

//     if (courseId) {
//         validateIds(courseId);
//         matchStage._id = new mongoose.Types.ObjectId(courseId);
//     }

//     if (ownerId) {
//         validateIds(ownerId);
//         matchStage.owner = new mongoose.Types.ObjectId(ownerId);
//     }

//     if (status) matchStage.status = status;

//     if (search) matchStage.name = { $regex: search, $options: 'i' };

//     const pipeline = [];

//     // Add filters
//     pipeline.push({ $match: { ...matchStage } });

//     // Fetch Course Topics
//     pipeline.push(fetchCourseTopics);

//     // Fetch Course Duration
//     pipeline.push(
//         {
//             $lookup: {
//                 from: 'sections',
//                 localField: '_id',
//                 foreignField: 'course',
//                 as: 'sections',
//                 pipeline: [
//                     {
//                         $match: {
//                             status: SECTION_STATUS.PUBLISHED,
//                         },
//                     },
//                     {
//                         $lookup: {
//                             from: 'videos',
//                             localField: 'videos.video',
//                             foreignField: '_id',
//                             as: 'videos',
//                             pipeline: [
//                                 {
//                                     $match: {
//                                         status: {
//                                             $ne: VIDEO_STATUS.UNPUBLISHED,
//                                         },
//                                     },
//                                 },
//                             ],
//                         },
//                     },
//                     {
//                         $addFields: {
//                             totalDuration: {
//                                 $sum: '$videos.duration',
//                             },
//                             totalVideos: {
//                                 $size: '$videos',
//                             },
//                         },
//                     },
//                 ],
//             },
//         },
//         {
//             $addFields: {
//                 totalDuration: {
//                     $sum: '$sections.totalDuration',
//                 },
//                 totalVideos: {
//                     $sum: '$sections.totalVideos',
//                 },
//             },
//         },
//         {
//             $match: {
//                 totalVideos: { $gt: 0 },
//             },
//         }
//     );

//     // Fetch Owner Details
//     pipeline.push(
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'owner',
//                 foreignField: '_id',
//                 as: 'owner',
//                 pipeline: [
//                     {
//                         $project: {
//                             username: 1,
//                             fullName: 1,
//                             avatar: 1,
//                             email: 1,
//                             bio: 1,
//                         },
//                     },
//                 ],
//             },
//         },
//         { $unwind: '$owner' }
//     );

//     pipeline.push({
//         $project: {
//             name: 1,
//             description: 1,
//             thumbnail: 1,
//             price: 1,
//             totalDuration: 1,
//             totalVideos: 1,
//             topics: 1,
//             owner: 1,
//             createdAt: 1,
//             updatedAt: 1,
//         },
//     });

//     const course = await Course.aggregate(pipeline);

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         courseId ? course[0] : course,
//         'Courses sent successfully'
//     );
// });

// const getInstructorCourses = asyncHandler(async (req, res) => {
//     const { courseId } = req.query;

//     const matchStage = {};

//     if (courseId) {
//         validateIds(courseId);
//         matchStage._id = new mongoose.Types.ObjectId(courseId);
//     }

//     const pipeline = [];

//     // Add filters
//     pipeline.push({ $match: { ...matchStage } });

//     // Fetch Course Topics, Course Sections and videos and it's topics
//     if (courseId) {
//         pipeline.push(fetchCourseTopics, {
//             $lookup: {
//                 from: 'sections',
//                 localField: '_id',
//                 foreignField: 'course',
//                 as: 'sections',
//                 pipeline: [
//                     {
//                         $lookup: {
//                             from: 'videos',
//                             localField: 'videos.video',
//                             foreignField: '_id',
//                             as: 'videos',
//                             pipeline: [fetchVideoTopics],
//                         },
//                     },
//                 ],
//             },
//         });
//     }

//     // Fetch Owner Details
//     if (courseId) {
//         pipeline.push(
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'owner',
//                     foreignField: '_id',
//                     as: 'owner',
//                     pipeline: [
//                         {
//                             $project: {
//                                 username: 1,
//                                 fullName: 1,
//                                 avatar: 1,
//                                 email: 1,
//                                 bio: 1,
//                             },
//                         },
//                     ],
//                 },
//             },
//             { $unwind: '$owner' }
//         );
//     }

//     const courses = await Course.aggregate(pipeline);

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         courseId ? courses[0] : courses,
//         'Course Details sent successfully'
//     );
// });

// const getLearnerCourse = asyncHandler(async (req, res) => {
//     const { courseId } = req.query;
//     validateIds(courseId);

//     const matchStage = { _id: new mongoose.Types.ObjectId(courseId) };

//     matchStage.status = COURSE_STATUS.PUBLISHED;

//     const course = await Course.aggregate([
//         {
//             $match: { ...matchStage },
//         },
//         fetchCourseTopics,
//         // Fetch Sections which are published and has at-least one video and Videos
//         {
//             $lookup: {
//                 from: 'sections',
//                 localField: '_id',
//                 foreignField: 'course',
//                 as: 'sections',
//                 pipeline: [
//                     {
//                         $match: {
//                             status: SECTION_STATUS.PUBLISHED,
//                             videos: { $exists: true, $ne: [] },
//                         },
//                     },
//                     {
//                         $lookup: {
//                             from: 'sectioncontents',
//                             localField: '_id',
//                             foreignField: 'section',
//                             as: 'videos',
//                             pipeline: [
//                                 {
//                                     $lookup: {
//                                         from: 'videos',
//                                         localField: 'videos',
//                                         foreignField: '_id',
//                                         as: 'videos',
//                                         pipeline: [
//                                             // check status is not unpublished
//                                             {
//                                                 $match: {
//                                                     status: {
//                                                         $ne: VIDEO_STATUS.UNPUBLISHED,
//                                                     },
//                                                 },
//                                             },
//                                             fetchVideoTopics,
//                                         ],
//                                     },
//                                 },
//                             ],
//                         },
//                     },
//                     {
//                         $match: {
//                             videos: { $exists: true, $ne: [] },
//                         },
//                     },
//                     // Add Section total duration
//                     {
//                         $addFields: {
//                             totalDuration: {
//                                 $sum: '$videos.duration',
//                             },
//                         },
//                     },
//                 ],
//             },
//         },
//         // Fetch Owner Details
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'owner',
//                 foreignField: '_id',
//                 as: 'owner',
//                 pipeline: [
//                     {
//                         $project: {
//                             username: 1,
//                             fullName: 1,
//                             avatar: 1,
//                             email: 1,
//                             bio: 1,
//                         },
//                     },
//                 ],
//             },
//         },
//         { $unwind: '$owner' },
//     ]);

//     if (!course || course.length === 0)
//         throw new ApiError(
//             StatusCodes.NOT_FOUND,
//             'Course not found or Published'
//         );

//     handleResponse(res, StatusCodes.OK, course[0], 'Course sent successfully');
// });

// const deleteCourse = asyncHandler(async (req, res) => {
//     const { courseId } = req.params;

//     validateIds(courseId);

//     const course = await Course.findByIdAndDelete(courseId);

//     if (!course)
//         throw new ApiError(
//             StatusCodes.NOT_FOUND,
//             'Course not found or already deleted'
//         );

//     await topicList.saveCourseTopics(courseId, []);

//     await cloudinary.deleteImageOnCloudinary(course.thumbnail);

//     // TODO: delete quizzes, progress, purchase of the course

//     const sections = await Section.find({ course: courseId });

//     if (sections?.length > 0) {
//         for (let i = 0; i < sections.length; i++) {
//             const section = await Section.findByIdAndDelete(sections[i]._id);

//             const videos = section?.videos;

//             if (videos?.length > 0) {
//                 for (let j = 0; j < videos.length; j++) {
//                     // delete video if it's status is not public
//                     const video = await Video.findOneAndDelete({
//                         _id: videos[j].video,
//                         status: { $ne: VIDEO_STATUS.PUBLIC },
//                     });
//                     // delete video from cloudinary
//                     if (video) {
//                         await cloudinary.deleteVideoOnCloudinary(
//                             video.videoFile
//                         );
//                         await cloudinary.deleteImageOnCloudinary(
//                             video.thumbnail
//                         );
//                     }
//                 }
//             }
//         }
//     }

//     handleResponse(res, StatusCodes.OK, course, 'Course deleted successfully');
// });

// const updateCourse = asyncHandler(async (req, res) => {
//     const { courseId } = req.params;
//     const { name, description, price, status, topics } = req.body;

//     validateIds(courseId);

//     const course = await Course.findById(courseId);
//     if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found');

//     const photoLocalPath = req.file?.path;

//     if (photoLocalPath) {
//         await cloudinary.deleteImageOnCloudinary(course.thumbnail);

//         const photo = await cloudinary.uploadPhotoOnCloudinary(photoLocalPath);

//         if (!photo)
//             throw new ApiError(
//                 StatusCodes.INTERNAL_SERVER_ERROR,
//                 'Something went wrong While uploading thumbnail file'
//             );

//         course.thumbnail = photo.url;
//     }

//     let updatedCourse = course;
//     let topicsArray = [];

//     if (typeof topics === 'string') {
//         const { topics: allTopics, topicIds } = await getTopics(topics);
//         await topicList.saveCourseTopics(courseId, topicIds);
//         topicsArray = allTopics;
//     } else {
//         course.name = name ?? course.name;
//         course.description = description ?? course.description;
//         course.price = price ? parseInt(price) : course.price;
//         course.status = status ?? course.status;

//         updatedCourse = await course.save();

//         if (!updatedCourse)
//             throw new ApiError(
//                 StatusCodes.INTERNAL_SERVER_ERROR,
//                 'Something went wrong while updating course'
//             );

//         const courseTopics = await topicList.getCourseTopics(courseId);
//         topicsArray = courseTopics.topics;
//     }

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         { ...updatedCourse._doc, topics: topicsArray },
//         'Course updated successfully'
//     );
// });

// const updateCourseStatus = asyncHandler(async (req, res) => {
//     const { courseId } = req.params;
//     const { status } = req.body;

//     validateFields(req, { body: ['status'] });
//     validateIds(courseId);

//     const course = await Course.findById(courseId);
//     if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found');

//     course.status = status;

//     const updatedCourse = await course.save();

//     if (!updatedCourse)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Something went wrong while updating course'
//         );

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         { _id: updatedCourse._id, status: updatedCourse.status },
//         'Course updated successfully'
//     );
// });

// export default {
//     createCourse,
//     deleteCourse,
//     getCourses,
//     getLearnerCourse,
//     getInstructorCourses,
//     updateCourse,
//     updateCourseStatus,
// };
