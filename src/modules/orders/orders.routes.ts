import { Router } from 'express';
import { authenticateJWT } from '../auth/jwt.middleware';
import { listOrdersController } from './orders.controller';

const router = Router();

router.get('/', authenticateJWT, listOrdersController);

export default router;