import { Router } from 'express';
import { qrController } from '../controllers/qr.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Validar QR o código (solo Organizador y Admin)
router.post('/validate', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => qrController.validate(req, res, next));

export default router;
