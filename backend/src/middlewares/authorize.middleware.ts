import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export function authorizeMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('No estás autenticado.', 401));
    }

    const userRole = req.user.role?.toUpperCase();

    if (!allowedRoles.map((r) => r.toUpperCase()).includes(userRole)) {
      return next(
        new AppError('No tienes permisos suficientes para realizar esta acción.', 403)
      );
    }

    next();
  };
}
