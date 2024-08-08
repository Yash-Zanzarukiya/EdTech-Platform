import mongoose from 'mongoose';
import { Course } from '../models/index.js';
import {
    asyncHandler,
    ApiError,
    handleResponse,
    validateFields,
    validateIds,
} from '../utils/index.js';
import { cloudinary } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';

const createCourse = asyncHandler(async (req, res) => {
    const { name, description, price, duration } = req.body;

    validateFields(req, { body: ['name', 'description', 'price'] });

    const photoLocalPath = req.file?.path;

    if (!photoLocalPath) throw new ApiError(400, 'All fields required');

    const photo = await cloudinary.uploadPhotoOnCloudinary(photoLocalPath);

    if (!photo) throw new ApiError(500, 'Error Accured While uploading File');

    const course = await Course.create({
        name,
        description,
        thumbnail: photo.url,
        price,
        duration,
        owner: req.user?._id,
    });

    if (!course)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error while creating Course'
        );

    handleResponse(
        res,
        StatusCodes.CREATED,
        course,
        'course Created Successfully'
    );
});

const getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const course = await Course.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
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
                        $sort: {
                            createdAt: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: '$owner',
        },
        {
            $project: {
                name: 1,
                description: 1,
                thumbnail: 1,
                price: 1,
                isPublished: 1,
                owner: 1,
                duration: 1,
                sections: 1,
            },
        },
    ]);

    if (!course[0]?.isPublished)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Course not published');

    handleResponse(res, StatusCodes.OK, course[0], 'course sent successfully');
});

const getAllCoursesByOwner = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    validateIds(userId);

    const course = await Course.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: '$owner',
        },
        {
            $project: {
                name: 1,
                description: 1,
                thumbnail: 1,
                price: 1,
                isPublished: 1,
                duration: 1,
                owner: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, course, 'Courses sent successfully');
});

const getAllCourses = asyncHandler(async (_, res) => {
    const course = await Course.aggregate([
        {
            $match: {
                isPublished: true,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: '$owner',
        },
        {
            $project: {
                name: 1,
                description: 1,
                thumbnail: 1,
                price: 1,
                owner: 1,
                duration: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, course, 'Courses sent successfully');
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) throw new ApiError(500, 'Error while deleting section');

    handleResponse(res, StatusCodes.OK, course, 'Course deleted successfully');
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const course = await Course.findById(courseId);

    if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found');

    course.isPublished = !course.isPublished;

    const updatedCourse = await course.save();

    if (!updatedCourse)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error while toggling'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        updatedCourse,
        'Course status toggled successfully'
    );
});

export default {
    createCourse,
    getCourseById,
    deleteCourse,
    togglePublishStatus,
    getAllCourses,
    getAllCoursesByOwner,
};
