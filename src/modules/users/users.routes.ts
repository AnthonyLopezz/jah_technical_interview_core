import { Router } from 'express';
import { authenticateJWT } from '../auth/jwt.middleware';
import { meController } from './users.controller';

const router = Router();

router.get('/me', authenticateJWT, meController);

export default router;