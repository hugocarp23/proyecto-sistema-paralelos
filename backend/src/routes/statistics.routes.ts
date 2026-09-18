import { Router } from 'express';
import { statisticsController } from '../controllers/statistics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Estadísticas del dashboard (Organizador y Admin)
router.get('/', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => statisticsController.getDashboardStats(req, res, next));

export default router;
