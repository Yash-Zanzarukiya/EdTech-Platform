import { StatusCodes } from 'http-status-codes';
import { Video } from '../models/index.js';
import {
    ApiError,
    handleResponse,
    asyncHandler,
    cloudinary,
    validateIds,
    validateFields,
    checkOneField,
} from '../utils/index.js';
const { uploadPhotoOnCloudinary, uploadVideoOnCloudinary } = cloudinary;
import { getTopics } from './topic.controller.js';
import { topicList, sectionContent } from './index.js';
import mongoose from 'mongoose';
import { VIDEO_STATUS } from '../constants.js';

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', owner, status } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const matchStage = {};
    const pipeline = [];

    if (owner) {
        if (owner == 'me') matchStage.owner = req.user?._id;
        else {
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

    // await Video.aggregatePaginate(allVideos, options, function (err, results) {
    //     if (!err) {
    //         const {
    //             docs,
    //             totalDocs,
    //             limit,
    //             page,
    //             totalPages,
    //             pagingCounter,
    //             hasPrevPage,
    //             hasNextPage,
    //             prevPage,
    //             nextPage,
    //         } = results;

    //         handleResponse(
    //             res,
    //             StatusCodes.OK,
    //             {
    //                 videos: docs,
    //                 totalDocs,
    //                 limit,
    //                 page,
    //                 totalPages,
    //                 pagingCounter,
    //                 hasPrevPage,
    //                 hasNextPage,
    //                 prevPage,
    //                 nextPage,
    //             },
    //             'Videos fetched successfully'
    //         );
    //     } else
    //         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
    // });
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

//TODO: delete transcript and progresses
const deleteOneVideo = async (videoId, conditions = {}) => {
    validateIds(videoId);

    const deletedVideo = await Video.deleteOne({
        _id: videoId,
        ...conditions,
    });

    if (!deletedVideo) {
        if (Object.keys(conditions).length > 0) {
            return true;
        } else {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Video Not Found');
        }
    }

    await cloudinary.deleteVideoOnCloudinary(deletedVideo.videoFile);
    await cloudinary.deleteImageOnCloudinary(deletedVideo.thumbnail);

    await sectionContent.toggleVideoToSectionContent(null, videoId, false);
    await topicList.saveVideoTopics(videoId, []);

    return deletedVideo;
};

const deleteManyVideos = async (videoIds = [], conditions = {}) => {
    if (!videoIds.length) return true;

    const deletedVideos = await Video.deleteMany({
        _id: { $in: videoIds },
        ...conditions,
    });

    if (deletedVideos.length) {
        for (let i = 0; i < deletedVideos.length; i++) {
            const video = deletedVideos[i];
            await cloudinary.deleteVideoOnCloudinary(video.videoFile);
            await cloudinary.deleteImageOnCloudinary(video.thumbnail);
            await topicList.saveVideoTopics(video._id, []);
            await sectionContent.toggleVideoToSectionContent(
                null,
                video,
                false
            );
        }
    }

    return deletedVideos;
};

export default {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    deleteOneVideo,
    deleteManyVideos,
};

// import { TopicList, Video } from '../models/index.js';
// import {
//     ApiError,
//     handleResponse,
//     asyncHandler,
//     cloudinary,
//     validateIds,
//     validateFields,
//     checkOneField,
// } from '../utils/index.js';
// import { StatusCodes } from 'http-status-codes';
// const { uploadPhotoOnCloudinary, uploadVideoOnCloudinary } = cloudinary;
// import { getTopics } from './topic.controller.js';
// import { toggleVideoToSection } from './section.controller.js';

// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10, query = '', owner, status } = req.query;

//     const options = {
//         page: parseInt(page, 10),
//         limit: parseInt(limit, 10),
//     };

//     const matchStage = {};
//     const pipeline = [];

//     if (owner) {
//         if (owner == 'me') matchStage.owner = req.user?._id;
//         else {
//             validateIds(owner);
//             matchStage.owner = owner;
//         }
//     }

//     if (status) matchStage.status = status;

//     pipeline.push({
//         $match: { ...matchStage },
//     });

//     if (query) {
//         const words = query.trim();

//         pipeline.push({
//             $match: {
//                 title: {
//                     $regex: words,
//                     $options: 'i',
//                 },
//             },
//         });
//     }

//     pipeline.push({
//         $sort: {
//             createdAt: -1,
//         },
//     });

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
//                         },
//                     },
//                 ],
//             },
//         },
//         {
//             $unwind: '$owner',
//         }
//     );

//     pipeline.push({
//         $project: {
//             id: { $toString: '$_id' },
//             title: 1,
//             duration: 1,
//             thumbnail: 1,
//             status: 1,
//             owner: 1,
//             createdAt: 1,
//         },
//     });

//     const allVideos = await Video.aggregate(pipeline);

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         allVideos,
//         'Videos fetched successfully'
//     );

//     // await Video.aggregatePaginate(allVideos, options, function (err, results) {
//     //     if (!err) {
//     //         const {
//     //             docs,
//     //             totalDocs,
//     //             limit,
//     //             page,
//     //             totalPages,
//     //             pagingCounter,
//     //             hasPrevPage,
//     //             hasNextPage,
//     //             prevPage,
//     //             nextPage,
//     //         } = results;

//     //         handleResponse(
//     //             res,
//     //             StatusCodes.OK,
//     //             {
//     //                 videos: docs,
//     //                 totalDocs,
//     //                 limit,
//     //                 page,
//     //                 totalPages,
//     //                 pagingCounter,
//     //                 hasPrevPage,
//     //                 hasNextPage,
//     //                 prevPage,
//     //                 nextPage,
//     //             },
//     //             'Videos fetched successfully'
//     //         );
//     //     } else
//     //         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
//     // });
// });

// const publishAVideo = asyncHandler(async (req, res) => {
//     const { title, description, topics, sectionId } = req.body;

//     validateFields(req, { body: ['title'] });

//     if (sectionId) validateIds(sectionId);

//     let videoFileLocalFilePath = '';
//     if (req.files && req.files.videoFile && req.files.videoFile.length > 0)
//         videoFileLocalFilePath = req.files.videoFile[0].path;
//     if (!videoFileLocalFilePath)
//         throw new ApiError(
//             StatusCodes.BAD_REQUEST,
//             'Video File Must be Required'
//         );

//     let thumbnailLocalFilePath = null;
//     if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0)
//         thumbnailLocalFilePath = req.files.thumbnail[0].path;
//     if (!thumbnailLocalFilePath)
//         throw new ApiError(
//             StatusCodes.BAD_REQUEST,
//             'Thumbnail File Must be Required'
//         );

//     const cldnry_res = await uploadVideoOnCloudinary(videoFileLocalFilePath);
//     if (!cldnry_res)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Something went wrong while Uploading Video File'
//         );

//     const thumbnailFile = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
//     if (!thumbnailFile)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Something went wrong while uploading thumbnail file'
//         );

//     const topicsArray = await getTopics(topics?.trim());
//     const topicIds = topicsArray.map((topic) => topic._id);

//     const video = await Video.create({
//         videoFile: cldnry_res.url,
//         title,
//         section: sectionId || null,
//         description: description || '',
//         thumbnail: thumbnailFile.url,
//         topics: topicIds || [],
//         duration: cldnry_res.duration,
//         owner: req.user?._id,
//     });

//     if (!video)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'An Error Occurred while Publishing Video'
//         );

//     await TopicList.create(
//         topicsArray.map((topic) => ({ topic: topic._id, video: video._id }))
//     );

//     if (sectionId) await toggleVideoToSection(sectionId, video._id);

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         { ...video._doc, topics: topicsArray, sectionId },
//         'Video published successfully'
//     );
// });

// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     validateIds(videoId);

//     const video = await Video.findById(videoId);

//     if (!video) throw new ApiError(StatusCodes.BAD_REQUEST, 'No video found');

//     handleResponse(res, StatusCodes.OK, video, 'Video sent successfully');
// });

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;
//     const { title, description, topics, status, sectionId } = req.body;

//     validateIds(videoId);

//     const thumbnailLocalFilePath = req.file?.path;

//     if (!thumbnailLocalFilePath)
//         checkOneField(req, ['title', 'description', 'topics', 'status']);

//     const video = await Video.findById(videoId);
//     if (!video) throw new ApiError(StatusCodes.NOT_FOUND, 'video not found');

//     let thumbnail = '';
//     if (thumbnailLocalFilePath) {
//         thumbnail = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
//         if (!thumbnail)
//             throw new ApiError(
//                 StatusCodes.INTERNAL_SERVER_ERROR,
//                 'Something went wrong while uploading thumbnail'
//             );
//     }

//     if (title) video.title = title;
//     if (description) video.description = description;
//     if (thumbnail) video.thumbnail = thumbnail.url;
//     if (status) video.status = status;

//     let topicsArray = [];
//     if (topics?.trim()) {
//         topicsArray = await getTopics(topics.trim());
//         video.topics = topicsArray.map((topic) => topic._id);
//     } else {
//         video.topics = topicsArray;
//     }

//     // Save in database
//     const updatedVideo = await video.save({ validateBeforeSave: false });

//     if (!updatedVideo)
//         throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Something went wrong while updating video'
//         );

//     handleResponse(
//         res,
//         StatusCodes.OK,
//         { ...updatedVideo._doc, topics: topicsArray, sectionId },
//         'Video updated successfully'
//     );
// });

// const deleteVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     validateIds(videoId);

//     //TODO: delete transcript and progresses

//     const findRes = await Video.findByIdAndDelete(videoId);

//     if (!findRes) throw new ApiError(StatusCodes.NOT_FOUND, 'Video Not Found');

//     await cloudinary.deleteVideoOnCloudinary(findRes.videoFile);
//     await cloudinary.deleteImageOnCloudinary(findRes.thumbnail);

//     await toggleVideoToSection(null, videoId, false);

//     handleResponse(res, StatusCodes.OK, findRes, 'Video deleted successfully');
// });

// export default {
//     getAllVideos,
//     publishAVideo,
//     getVideoById,
//     updateVideo,
//     deleteVideo,
// };
