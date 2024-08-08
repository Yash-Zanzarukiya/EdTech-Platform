import { StatusCodes } from 'http-status-codes';
import { Purchase } from '../models/index.js';
import {
    handleResponse,
    ApiError,
    asyncHandler,
    validateIds,
} from '../utils/index.js';

const addCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    validateIds(courseId);

    const course = await Purchase.create({
        lerner: req.user?._id,
        course: courseId,
    });

    if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found');

    handleResponse(res, StatusCodes.OK, course, 'course added successfully');
});

const getPurchasedCourses = asyncHandler(async (req, res) => {
    const course = await Purchase.find({
        lerner: req.user?._id,
    });

    handleResponse(
        res,
        StatusCodes.OK,
        course,
        'Courses retrieved successfully'
    );
});

export default { addCourse, getPurchasedCourses };
