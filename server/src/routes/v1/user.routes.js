import { Router } from 'express';
import { userController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';

const router = Router();

router
    .route('/profile/:identifier')
    .get(userController.getUserProfile)
    .patch(verifyJWT, userController.updateUserProfile);

export default router;
