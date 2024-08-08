import { StatusCodes } from 'http-status-codes';
import { User } from '../models/index.js';
import { ApiError, asyncHandler, handleResponse } from '../utils/index.js';

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, gradYear, university, branch } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user)
        throw new ApiError(
            404,
            'User not found with this ID. Please try again'
        );

    if (fullName) user.fullName = fullName;

    if (gradYear) user.gradYear = gradYear;

    if (university) user.university = university;

    if (branch) user.branch = branch;

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

// getUserProfile

const getUserProfile = asyncHandler(async (req, res) => {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, 'User not found with this email');

    handleResponse(
        res,
        StatusCodes.OK,
        user,
        'User profile retrieved successfully'
    );
});

const userController = {
    updateUserProfile,
    getUserProfile,
};

export default userController;
