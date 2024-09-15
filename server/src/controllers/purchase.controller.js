import { StatusCodes } from 'http-status-codes';
import { Cart, Course, Purchase } from '../models/index.js';
import { handleResponse, asyncHandler } from '../utils/index.js';

const addCourse = asyncHandler(async (req, res) => {
    const { courseIds = [] } = req.body;

    const courses = courseIds.map((courseId) => ({
        course: courseId,
        lerner: req.user?._id,
    }));

    await Purchase.insertMany(courses);

    await removeFromCart(courseIds);

    handleResponse(res, StatusCodes.OK, courses, 'course added successfully');
});

const getPurchasedCourses = asyncHandler(async (req, res) => {
    const courses =
        await Purchase.aggregate[
            ({
                $match: {
                    lerner: req.user?._id,
                },
            },
            {
                $lookup: {
                    from: 'progresses',
                    localField: 'course',
                    foreignField: 'course',
                    as: 'progresses',
                    pipeline: [
                        {
                            $match: {
                                user: req.user?._id,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'course',
                },
            },
            {
                $unwind: '$course',
            },
            {
                $project: {
                    _id: 0,
                    course: 1,
                    hadCertificate: 1,
                    '$course.progress': {
                        $size: '$progresses',
                    },
                },
            })
        ];

    handleResponse(res, StatusCodes.OK, courses, 'Courses sent successfully');
});

const getCartCourses = asyncHandler(async (req, res) => {
    const courses = await Cart.aggregate([
        {
            $match: {
                user: req.user?._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $project: {
                _id: 0,
                course: 1,
            },
        },
    ]);

    handleResponse(res, StatusCodes.OK, courses, 'Courses sent successfully');
});

const addCoursesToCart = asyncHandler(async (req, res) => {
    const { courseIds = [] } = req.body;

    const courses = courseIds.map((courseId) => ({
        course: courseId,
        user: req.user?._id,
    }));

    const cartCourses = await Cart.insertMany(courses);

    handleResponse(
        res,
        StatusCodes.OK,
        cartCourses,
        'Courses sent successfully'
    );
});

const removeCourseFromCart = asyncHandler(async (req, res) => {
    const { courseIds = [] } = req.body;

    const cartCourses = await removeFromCart(courseIds);

    handleResponse(
        res,
        StatusCodes.OK,
        cartCourses,
        'Courses removed successfully'
    );
});

const removeFromCart = async (courseIds = []) => {
    const courses = courseIds.map((courseId) => ({
        course: courseId,
        user: req.user?._id,
    }));

    const cartCourses = await Cart.deleteMany(courses);

    return courseIds;
};

const updateCertificateEligibility = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const purchase = await Purchase.findOneAndUpdate(
        {
            course: courseId,
            lerner: req.user?._id,
        },
        {
            hasCertificate: true,
        },
        {
            new: true,
        }
    );

    handleResponse(
        res,
        StatusCodes.OK,
        purchase,
        'Purchase updated successfully'
    );
});

export default {
    addCourse,
    getPurchasedCourses,
    getCartCourses,
    addCoursesToCart,
    removeCourseFromCart,
    updateCertificateEligibility,
};
