import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';
import { AuthenticatedUser } from '../interfaces/auth.interface.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No estás autenticado. Por favor inicia sesión para acceder.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Token de autenticación no proporcionado o formato inválido.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 401));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError('Token de autenticación inválido.', 401));
    } else {
      next(error);
    }
  }
}
