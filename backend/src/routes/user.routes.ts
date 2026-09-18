import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js';

const router = Router();

// Rutas de perfil personal
router.get('/profile', authMiddleware, (req, res, next) => userController.getProfile(req, res, next));
router.put('/profile', authMiddleware, (req, res, next) => userController.updateProfile(req, res, next));

// Rutas administrativas
router.get('/', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => userController.getAllUsers(req, res, next));
router.get('/roles', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => userController.getRoles(req, res, next));
router.patch('/:id/status', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => userController.updateUserStatus(req, res, next));
router.patch('/:id/role', authMiddleware, authorizeMiddleware('ADMIN'), (req, res, next) => userController.updateUserRole(req, res, next));

export default router;
