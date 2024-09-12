import { StatusCodes } from 'http-status-codes';
import { User } from '../models/index.js';
import {
    ApiError,
    asyncHandler,
    handleResponse,
    cloudinary,
} from '../utils/index.js';

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, gradYear, university, branch, bio, profileStatus } =
        req.body;

    const user = await User.findById(req.user?._id);

    if (!user)
        throw new ApiError(
            404,
            'User not found with this ID. Please try again'
        );

    if (fullName) user.fullName = fullName;

    if (gradYear) user.gradYear = parseInt(gradYear);

    if (university) user.university = university;

    if (branch) user.branch = branch;

    if (bio) user.bio = bio;

    if (profileStatus) user.profileStatus = profileStatus;

    let updatedUserData = await user.save();

    updatedUserData = await User.findById(updatedUserData._id);

    if (!updatedUserData)
        throw new ApiError(500, 'Error while Updating User Data');

    handleResponse(
        res,
        StatusCodes.OK,
        updatedUserData,
        'Profile updated Successfully'
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
    const { identifier } = req.params;

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) throw new ApiError(404, 'User not found with this email');

    handleResponse(
        res,
        StatusCodes.OK,
        user,
        'User profile retrieved successfully'
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Avatar file required');

    const avatarImg = await cloudinary.uploadPhotoOnCloudinary(avatarLocalPath);

    if (!avatarImg)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred While updating avatar'
        );

    const user = await User.findById(req.user?._id);

    if (!user)
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User not found');

    await cloudinary.deleteImageOnCloudinary(user.avatar);

    user.avatar = avatarImg.url;

    const updatedUser = await user.save({ validateBeforeSave: false });

    handleResponse(
        res,
        StatusCodes.OK,
        updatedUser,
        'avatar updated Successfully'
    );
});

const userController = {
    updateUserProfile,
    getUserProfile,
    updateUserAvatar,
};

export default userController;
