import { Router } from 'express';
import { userController } from '../../controllers/index.js';
import { verifyJWT } from '../../middlewares/index.js';

const router = Router();

router.get('/get', verifyJWT, (req, res) => {
    res.send('Hello World')
})

export default router;