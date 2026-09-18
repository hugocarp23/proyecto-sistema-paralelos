import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Entradas del usuario actual (Billetera digital)
router.get('/my', authMiddleware, (req, res, next) => ticketController.getMyTickets(req, res, next));

// Entradas por evento (Organizador o Admin)
router.get('/event/:eventId', authMiddleware, authorizeMiddleware('ORGANIZADOR', 'ADMIN'), (req, res, next) => ticketController.getByEvent(req, res, next));

// Detalle de entrada con QR
router.get('/:id', authMiddleware, (req, res, next) => ticketController.getById(req, res, next));

export default router;
