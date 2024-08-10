import { Router } from 'express';
import { authController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';
const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/me', verifyJWT, authController.me);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/username/:username', authController.checkUsername);

export default router;
