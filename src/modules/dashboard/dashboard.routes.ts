import { Router } from 'express';
import { authenticateJWT } from '../auth/jwt.middleware';
import { kpisController, timeSeriesController } from './dashboard.controller';

const router = Router();

router.get('/kpis', authenticateJWT, kpisController);
router.get('/timeseries', authenticateJWT, timeSeriesController);

export default router;