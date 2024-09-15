import { StatusCodes } from 'http-status-codes';
import { Cart, Purchase } from '../models/index.js';
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

const getCartCourses = asyncHandler(async (req, res) => {
    const courses = await Cart.find({
        user: req.user?._id,
    });

    handleResponse(res, StatusCodes.OK, courses, 'Courses sent successfully');
});

const addCoursesToCart = asyncHandler(async (req, res) => {
    const { courseIds = [] } = req.body;
    console.log(courseIds)

    const courses = courseIds.map((courseId) => ({
        course: courseId,
        user: req.user?._id,
    }));

    const cartCourses = await Cart.insertMany(courses);
    console.log("alp",cartCourses)

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

export default {
    addCourse,
    getPurchasedCourses,
    getCartCourses,
    addCoursesToCart,
    removeCourseFromCart,
};
