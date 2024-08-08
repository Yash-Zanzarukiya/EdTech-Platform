import { Router } from 'express';
import { authController } from '../../controllers/index.js';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/me', authController.me);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);

export default router;
