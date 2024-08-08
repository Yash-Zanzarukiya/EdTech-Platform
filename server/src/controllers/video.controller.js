import { Video, Topic } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    cloudinary,
    validateIds,
    validateFields,
} from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
const { uploadPhotoOnCloudinary, uploadVideoOnCloudinary } = cloudinary;

// TODO: look in to publish status

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', userId, all } = req.query;

    validateIds(userId);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    // if (isValidObjectId(userId)) filters.owner = userId;

    const pipeline = [];

    if (!all) {
        pipeline.push({
            $match: {
                isPublished: true,
            },
        });
    }

    if (query) {
        const words = query.trim();

        pipeline.push({
            $match: {
                title: {
                    $regex: words,
                    $options: 'i',
                },
            },
        });
    }

    pipeline.push({
        $sort: {
            createdAt: -1,
        },
    });

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
                            _id: 1,
                            fullName: 1,
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
                videoFile: 1,
                title: 1,
                description: 1,
                duration: 1,
                thumbnail: 1,
                owner: 1,
                course: 1,
            },
        }
    );

    const allVideos = Video.aggregate(pipeline);

    // console.log("allvideos: ",allVideos);

    await Video.aggregatePaginate(allVideos, options, function (err, results) {
        if (!err) {
            const {
                docs,
                totalDocs,
                limit,
                page,
                totalPages,
                pagingCounter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            } = results;

            handleResponse(
                res,
                StatusCodes.OK,
                {
                    videos: docs,
                    totalDocs,
                    limit,
                    page,
                    totalPages,
                    pagingCounter,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                },
                'Videos fetched successfully'
            );
        } else
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
    });
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, topics } = req.body;
    const { sectionId } = req.params;

    validateIds(sectionId);
    validateFields(req, { body: ['title', 'description', 'topics'] });

    let videoFileLocalFilePath = '';
    if (req.files && req.files.videoFile && req.files.videoFile.length > 0)
        videoFileLocalFilePath = req.files.videoFile[0].path;

    if (!videoFileLocalFilePath)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Video File Must be Required'
        );

    let thumbnailLocalFilePath = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0)
        thumbnailLocalFilePath = req.files.thumbnail[0].path;

    if (!thumbnailLocalFilePath)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Thumbnail File Must be Required'
        );

    // const { cldnry_res, summary } = await uploadVideoOnCloudinary(videoFileLocalFilePath);
    const cldnry_res = await uploadVideoOnCloudinary(videoFileLocalFilePath);

    if (!cldnry_res)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error while Uploading Video File'
        );

    const thumbnailFile = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
    if (!thumbnailFile)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error while uploading thumbnail file'
        );

    // TODO : Implement this check this
    let topicRes;
    if (topics?.length > 0) {
        topicRes = await Topic.create(
            topics.map((topic) => ({ name: topic.trim(), video: video._id }))
        );
    }

    const video = await Video.create({
        videoFile: cldnry_res.url,
        // summary,
        title,
        description: description || '',
        duration: cldnry_res.duration,
        thumbnail: thumbnailFile.url,
        owner: req.user._id,
    });

    if (!video)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while Publishing Video'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        { video, topicRes },
        'Video published successfully'
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    validateIds(videoId);

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(StatusCodes.BAD_REQUEST, 'No video found');

    handleResponse(res, StatusCodes.OK, video, 'Video sent successfully');
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    validateIds(videoId);
    validateFields(req, { body: ['title', 'description'] });

    const thumbnailLocalFilePath = req.file?.path;
    if (!title && !description && !thumbnailLocalFilePath)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'At-least one field required'
        );

    //  check only owner can modify video
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(StatusCodes.NOT_FOUND, 'video not found');

    if (video.owner.toString() !== req.user?._id.toString())
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Only owner can modify video details'
        );

    //Update based on data sent
    let thumbnail;
    if (thumbnailLocalFilePath) {
        thumbnail = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
        if (!thumbnail)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An Error Occurred while uploading photo'
            );
    }

    if (title) video.title = title;
    if (description) video.description = description;
    if (thumbnail) video.thumbnail = thumbnail.url;

    // Save in database
    const updatedVideo = await video.save({ validateBeforeSave: false });

    if (!updatedVideo)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while updating thumbnail'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        updatedVideo,
        'Video updated successfully'
    );
});

// TODO: Complete this
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    validateIds(videoId);

    const findRes = await Video.findByIdAndDelete(videoId);

    if (!findRes) throw new ApiError(400, 'Video not found');

    handleResponse(res, StatusCodes.OK, findRes, 'Video deleted successfully');
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { publishStatus } = req.body;

    validateIds(videoId);

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(StatusCodes.NOT_FOUND, 'Video not found');

    video.publishStatus = publishStatus;
    const updatedVideo = await video.save();

    if (!updatedVideo)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while Saving status'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        { publishStatus: updatedVideo.publishStatus },
        'Video status saved successfully'
    );
});

export default {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
