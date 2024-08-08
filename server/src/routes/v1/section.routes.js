import { Router } from 'express';
import { verifyJWT } from '../../middlewares/index.js';
import sectionController from '../../controllers/section.controller.js';

const {
    createSection,
    getCourseSections,
    getSectionById,
    addVideoToSection,
    removeVideoFromSection,
    deleteSection,
} = sectionController;

const router = Router();

router.route('/course/:courseId').get(getCourseSections);
router.route('/create/:courseId').post(verifyJWT, createSection);
router.route('/add/:sectionId/:videoId').patch(verifyJWT, addVideoToSection);
router
    .route('/remove/:sectionId/:videoId')
    .patch(verifyJWT, removeVideoFromSection);
router
    .route('/:sectionId')
    .get(getSectionById)
    .delete(verifyJWT, deleteSection);

export default router;
