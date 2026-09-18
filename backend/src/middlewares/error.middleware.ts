import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Ocurrió un error interno en el servidor.';

  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [Error ${statusCode}] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
