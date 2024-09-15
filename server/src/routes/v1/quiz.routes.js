import { Router } from 'express';
import { quizController } from '../../controllers/index.js';

const router = Router();

router
    .route('/')// Get courses
    .post(quizController.createQuiz); // Create course

export default router;
