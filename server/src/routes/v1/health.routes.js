import { Router } from 'express';
import { checkHealth } from '../../controllers/index.js';

const router = Router();

router.route('').get(checkHealth);

export default router;
