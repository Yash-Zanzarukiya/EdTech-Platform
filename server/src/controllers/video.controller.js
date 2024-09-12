import { StatusCodes } from 'http-status-codes';
import { Progress, Transcript, Video } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    cloudinary,
    validateIds,
    validateFields,
    checkOneField,
    fetchVideoTranscript,
    fetchYouTubeVideos,
} from '../utils/index.js';
const { uploadPhotoOnCloudinary, uploadVideoOnCloudinary } = cloudinary;
import { getTopics } from './topic.controller.js';
import { topicList, sectionContent } from './index.js';
import mongoose from 'mongoose';
import { getStreamUrl } from '../utils/fetchYouTubeVideos.js';
import { VIDEO_STATUS } from '../constants.js';

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', owner, status } = req.query;

    const matchStage = {};
    const pipeline = [];

    if (owner) {
        if (owner == 'me') {
            matchStage.owner = req.user?._id;
            match.$or = [{ status: VIDEO_STATUS.PUBLIC }, { section: null }];
        } else {
            validateIds(owner);
            matchStage.owner = owner;
        }
    }

    if (status) matchStage.status = status;

    pipeline.push({
        $match: { ...matchStage },
    });

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
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: '$owner',
        }
    );

    pipeline.push({
        $project: {
            id: { $toString: '$_id' },
            title: 1,
            duration: 1,
            thumbnail: 1,
            status: 1,
            section: 1,
            owner: 1,
            createdAt: 1,
        },
    });

    const allVideos = await Video.aggregate(pipeline);

    handleResponse(
        res,
        StatusCodes.OK,
        allVideos,
        'Videos fetched successfully'
    );
});

const getAllPublicVideos = asyncHandler(async (req, res) => {
    const pipeline = [];

    pipeline.push({
        $match: {
            owner: req.user?._id,
            $or: [{ status: VIDEO_STATUS.PUBLIC }, { section: null }],
        },
    });

    pipeline.push({
        $sort: {
            createdAt: -1,
        },
    });

    pipeline.push({
        $project: {
            id: { $toString: '$_id' },
            title: 1,
            duration: 1,
            thumbnail: 1,
            status: 1,
            section: 1,
            createdAt: 1,
        },
    });

    const allVideos = await Video.aggregate(pipeline);

    handleResponse(
        res,
        StatusCodes.OK,
        allVideos,
        'Videos fetched successfully'
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    validateIds(videoId);

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(StatusCodes.NOT_FOUND, 'video not found');

    handleResponse(res, StatusCodes.OK, video, 'Video sent successfully');
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, topics, sectionId } = req.body;

    validateFields(req, { body: ['title'] });

    if (sectionId) validateIds(sectionId);

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

    const transcript = await fetchVideoTranscript(videoFileLocalFilePath);

    const videoRes = await uploadVideoOnCloudinary(videoFileLocalFilePath);
    if (!videoRes)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while Uploading Video File'
        );

    const thumbnailFile = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
    if (!thumbnailFile)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while uploading thumbnail file'
        );

    const video = await Video.create({
        title,
        videoFile: videoRes.url,
        thumbnail: thumbnailFile.url,
        description: description || '',
        duration: videoRes.duration,
        section: sectionId,
        owner: req.user?._id,
    });

    if (!video)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'An Error Occurred while Publishing Video'
        );

    await Transcript.create({ video: video._id, transcript });

    const { topics: topicsArray, topicIds } = await getTopics(topics);

    await topicList.saveVideoTopics(video._id, topicIds);

    if (sectionId)
        await sectionContent.toggleVideoToSectionContent(sectionId, video._id);

    handleResponse(
        res,
        StatusCodes.OK,
        { ...video._doc, topics: topicsArray, sectionId },
        'Video published successfully'
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, topics, status, sectionId } = req.body;

    validateIds(videoId);

    const thumbnailLocalFilePath = req.file?.path;

    if (!thumbnailLocalFilePath)
        checkOneField(req, ['title', 'description', 'topics', 'status']);

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(StatusCodes.NOT_FOUND, 'video not found');

    let thumbnail = '';
    if (thumbnailLocalFilePath) {
        thumbnail = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
        if (!thumbnail)
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Something went wrong while uploading thumbnail'
            );
    }

    if (sectionId) video.section = sectionId;
    if (title) video.title = title;
    if (description) video.description = description;
    if (thumbnail) video.thumbnail = thumbnail.url;
    if (status) video.status = status;
    const updatedVideo = await video.save();

    const { topicIds, topics: topicsArray } = await getTopics(topics);
    await topicList.saveVideoTopics(videoId, topicIds);

    if (!updatedVideo)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went wrong while updating video'
        );

    handleResponse(
        res,
        StatusCodes.OK,
        { ...updatedVideo._doc, topics: topicsArray, sectionId },
        'Video updated successfully'
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const deletedVideo = await deleteOneVideo(videoId);

    handleResponse(
        res,
        StatusCodes.OK,
        deletedVideo,
        'Video deleted successfully'
    );
});

const saveYouTubeVideos = asyncHandler(async (req, res) => {
    const { videoURLs, sectionId } = req.body;

    let videos = await fetchYouTubeVideos(videoURLs);
    let createdVideos = [];

    for (let i = 0; i < videos.length; i++) {
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

        if (sectionId) {
            await sectionContent.toggleVideoToSectionContent(
                sectionId,
                video._id
            );
        }
    }

    handleResponse(
        res,
        StatusCodes.OK,
        { videos: createdVideos || [], sectionId },
        'Video published successfully'
    );
});

const getYTStreamURL = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const streamURL = await getStreamUrl(videoId);

    handleResponse(
        res,
        StatusCodes.OK,
        streamURL,
        'Stream URL sent successfully'
    );
});

const deleteOneVideo = async (videoId, conditions = {}) => {
    validateIds(videoId);

    const deletedVideo = await deleteManyVideos([videoId], conditions);

    return deletedVideo.length ? deletedVideo[0] : {};
};

const deleteManyVideos = async (videoIds = [], conditions = {}) => {
    if (!videoIds.length) return true;
    console.log({ videoIds });

    const deletedVideos = await Video.find({
        _id: { $in: videoIds },
        ...conditions,
    });

    await Video.deleteMany({
        _id: { $in: videoIds },
        ...conditions,
    });

    if (deletedVideos.length) {
        for (let i = 0; i < deletedVideos.length; i++) {
            const { videoFile, thumbnail, _id } = deletedVideos[i];

            await cloudinary.deleteImageOnCloudinary(thumbnail);
            await cloudinary.deleteVideoOnCloudinary(videoFile);

            await sectionContent.toggleVideoToSectionContent(null, _id, false);
            await topicList.saveVideoTopics(_id, []);
            await Transcript.findOneAndDelete({ video: _id });
            await Progress.deleteMany({ video: _id });

            console.log(
                `deleted video ${i + 1} out of ${deletedVideos.length}`
            );
        }
    }

    return deletedVideos;
};

export default {
    getAllVideos,
    getAllPublicVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    deleteOneVideo,
    deleteManyVideos,
    saveYouTubeVideos,
    getYTStreamURL,
};
