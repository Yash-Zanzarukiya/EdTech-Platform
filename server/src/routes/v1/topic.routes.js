import { Router } from 'express';
import { topicController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';
const { getAllTopics, createTopics } = topicController;

const router = Router();

router.route('/').get(getAllTopics).post(verifyJWT, createTopics);

export default router;
