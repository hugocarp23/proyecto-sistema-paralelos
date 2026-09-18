import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Listado de asistencias registradas (Organizador y Admin)
router.get('/', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => attendanceController.getAll(req, res, next));

export default router;
