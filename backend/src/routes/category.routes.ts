import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Públicas
router.get('/', (req, res, next) => categoryController.getAll(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getById(req, res, next));

// Solo Admin
router.post('/', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => categoryController.create(req, res, next));
router.put('/:id', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => categoryController.update(req, res, next));
router.delete('/:id', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => categoryController.delete(req, res, next));

export default router;
