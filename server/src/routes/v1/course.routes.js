import { Router } from 'express';
import { verifyJWT, upload } from '../../middlewares/index.js';
import { courseController } from '../../controllers/index.js';

const router = Router();

router
    .route('/')
    .get(courseController.getCourses) // Get courses
    .post(verifyJWT, upload.single('thumbnail'), courseController.createCourse); // Create course

router
    .route('/:courseId')
    .patch(verifyJWT, upload.single('thumbnail'), courseController.updateCourse) // Update course
    .delete(verifyJWT, courseController.deleteCourse); // Delete course

export default router;
