import { Router } from 'express';
import { verifyJWT } from '../../middlewares/index.js';
import { sectionController } from '../../controllers/index.js';

const router = Router();

router.route('/course/:courseId').get(sectionController.getCourseSections);
router
    .route('/create/:courseId')
    .post(verifyJWT, sectionController.createSection);
router
    .route('/:sectionId')
    .get(sectionController.getSectionById)
    .patch(verifyJWT, sectionController.updateSection)
    .delete(verifyJWT, sectionController.deleteSection);

export default router;
