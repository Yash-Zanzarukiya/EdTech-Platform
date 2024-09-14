import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import purchaseRouter from './purchase.routes.js';
import courseRouter from './course.routes.js';
import progressRouter from './progress.routes.js';
import topicRouter from './topic.routes.js';
import sectionRouter from './section.routes.js';
import videoRouter from './video.routes.js';
import goalRouter from './goal.routes.js';

const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/purchase', purchaseRouter);
v1Router.use('/course', courseRouter);
v1Router.use('/progress', progressRouter);
v1Router.use('/topic', topicRouter);
v1Router.use('/section', sectionRouter);
v1Router.use('/video', videoRouter);
v1Router.use('/goal', goalRouter);

export default v1Router;
