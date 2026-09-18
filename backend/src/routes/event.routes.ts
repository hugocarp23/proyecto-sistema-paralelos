import { Router } from 'express';
import { eventController } from '../controllers/event.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Públicas
router.get('/', (req, res, next) => eventController.getAll(req, res, next));
router.get('/:id', (req, res, next) => eventController.getById(req, res, next));

// Organizador y Admin
router.post('/', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => eventController.create(req, res, next));
router.put('/:id', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => eventController.update(req, res, next));
router.delete('/:id', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => eventController.delete(req, res, next));

export default router;
