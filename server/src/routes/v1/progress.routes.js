import { Router } from 'express';
import progressController from '../../controllers/progress.controller.js';
const { toggleProgressStatus } = progressController;
import { verifyJWT } from '../../middlewares/index.js';

const router = Router();

router.use(verifyJWT);

router.route('/:courseId/:videoId').patch(toggleProgressStatus);

export default router;
