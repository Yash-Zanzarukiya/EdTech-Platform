import { Router } from 'express';
import { videoController } from '../../controllers/index.js';
import { verifyJWT, upload } from '../../middlewares/index.js';

const router = Router();

router.route('/').get(verifyJWT, videoController.getAllVideos);

router
    .route('/inst/public')
    .get(verifyJWT, videoController.getAllInstructorPublicVideos);

router.route('/add/publish').post(
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
    videoController.publishAVideo
);

router.route('/add/yt').post(verifyJWT, videoController.saveYouTubeVideos);

router.route('/yt/stream/:videoId').get(videoController.getYTStreamURL);

router
    .route('/:videoId')
    .get(videoController.getVideoById)
    .delete(verifyJWT, videoController.deleteVideo)
    .patch(verifyJWT, upload.single('thumbnail'), videoController.updateVideo);

export default router;
