import { Router } from 'express';
import { goalController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';
const router = Router();

router.use(verifyJWT);

router
    .route('/')
    .get(goalController.getUserGoals)
    .post(goalController.createGoal);

router
    .route('/:goalId')
    .get(goalController.getGoalById)
    .patch(goalController.updateGoal)
    .delete(goalController.deleteGoal);

export default router;
