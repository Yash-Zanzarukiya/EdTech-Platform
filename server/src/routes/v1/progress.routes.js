import { Router } from 'express';
import { progressController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';

const router = Router();

router.use(verifyJWT);

router.route('/:courseId').patch(progressController.getUserProgress);

router
    .route('/toggle/:courseId/:videoId')
    .patch(progressController.toggleProgressStatus);

export default router;
