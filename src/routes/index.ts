import { Router } from 'express';
import healthRouter from './health';
import authRouter from '../modules/auth/auth.routes';
import usersRouter from '../modules/users/users.routes';
import dashboardRouter from '../modules/dashboard/dashboard.routes';
import ordersRouter from '../modules/orders/orders.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/dashboard', dashboardRouter);