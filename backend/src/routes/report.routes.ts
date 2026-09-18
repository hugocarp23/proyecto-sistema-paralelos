import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Reportes parametrizados (Organizador y Admin)
router.get('/', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => reportController.generate(req, res, next));

export default router;
