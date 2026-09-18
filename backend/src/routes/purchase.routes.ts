import { Router } from 'express';
import { purchaseController } from '../controllers/purchase.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Comprar entradas (autenticado)
router.post('/', authMiddleware, (req, res, next) => purchaseController.create(req, res, next));

// Mis compras (usuario autenticado)
router.get('/my', authMiddleware, (req, res, next) => purchaseController.getMyPurchases(req, res, next));

// Todas las compras (Admin u Organizador de sus eventos)
router.get('/', authMiddleware, authorizeMiddleware('ADMIN', 'ORGANIZADOR'), (req, res, next) => purchaseController.getAll(req, res, next));

// Detalle de compra
router.get('/:id', authMiddleware, (req, res, next) => purchaseController.getById(req, res, next));

export default router;
