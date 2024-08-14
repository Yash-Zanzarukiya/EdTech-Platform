import { Router } from 'express';
import { topicController } from '../../controllers/index.js';

const router = Router();

router.route('/').get(topicController.getAllTopics);

export default router;
