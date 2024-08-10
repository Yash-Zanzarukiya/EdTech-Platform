import { Router } from 'express';
import { userController } from '../../controllers/index.js';
import { upload, verifyJWT } from '../../middlewares/index.js';

const router = Router();

router.route('/profile').patch(verifyJWT, userController.updateUserProfile);
router.route('/profile/:identifier').get(userController.getUserProfile);
router
    .route('/avatar')
    .patch(verifyJWT, upload.single('avatar'), userController.updateUserAvatar);

export default router;
