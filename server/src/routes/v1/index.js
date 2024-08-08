import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import purchaseRouter from './purchase.routes.js';
import courseRouter from './course.routes.js';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/purchase', purchaseRouter);
v1Router.use('/course', courseRouter);

export default v1Router;
