import { Router } from 'express';
import { purchaseController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';
const router = Router();

router.use(verifyJWT);

router.route('/:courseId').post(purchaseController.addCourse);
router.route('/').get(purchaseController.getPurchasedCourses);

export default router;
