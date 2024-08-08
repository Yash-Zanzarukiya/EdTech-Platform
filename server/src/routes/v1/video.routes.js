import { Router } from 'express';
import videoController from '../../controllers/index.js';
const {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
} = videoController;

import { verifyJWT, upload } from '../../middlewares/index.js';

const router = Router();

router.route('/').get(getAllVideos);
router.route('/publish/:sectionId').post(
    verifyJWT,
    upload.fields([
        {
            name: 'videoFile',
            maxCount: 1,
        },
        {
            name: 'thumbnail',
            maxCount: 1,
        },
    ]),
    publishAVideo
);

router
    .route('/:videoId')
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single('thumbnail'), updateVideo);

router.route('/toggle/publish/:videoId').patch(verifyJWT, togglePublishStatus);

export default router;
