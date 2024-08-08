import { Progress } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    validateIds,
} from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';

// TODO: think about the logic of this controller

const toggleProgressStatus = asyncHandler(async (req, res) => {
    const { courseId, videoId } = req.params;

    validateIds(courseId, videoId);

    const progress = await Progress.findOne({
        user: req.user._id,
        course: courseId,
        video: videoId,
    });

    if (!progress) {
        const newProgress = await Progress.create({
            user: req.user?._id,
            course: courseId,
            video: videoId,
        });
        if (!newProgress)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An Error occurred while saving progress'
            );
    } else {
        const deletedProgress = await Progress.findByIdAndDelete(progress._id);
        if (!deletedProgress)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An Error occurred while deleting progress'
            );
    }

    handleResponse(
        res,
        StatusCodes.OK,
        { isCompleted: !progress },
        'Progress Saved successfully'
    );
});

export default { toggleProgressStatus };
