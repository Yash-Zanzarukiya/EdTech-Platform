import { Router } from 'express';
import { verifyJWT, upload } from '../../middlewares/index.js';
import { courseController } from '../../controllers/index.js';

const {
    createCourse,
    getCourseById,
    deleteCourse,
    togglePublishStatus,
    getAllCourses,
    getAllCoursesByOwner,
} = courseController;

const router = Router();

router.route('/').get(getAllCourses);
router.route('/:courseId').get(getCourseById).delete(verifyJWT, deleteCourse);
router.route('/user/:userId').get(getAllCoursesByOwner);
router.route('/toggle/:courseId').patch(verifyJWT, togglePublishStatus);
router
    .route('/publish')
    .post(verifyJWT, upload.single('thumbnail'), createCourse);

export default router;
