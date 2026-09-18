import { Request, Response, NextFunction } from 'express';
import { qrService } from '../services/qr.service.js';

export class QrController {
  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { qrToken, code } = req.body;
      const tokenToValidate = qrToken || code;

      const result = await qrService.validateQr(
        tokenToValidate,
        req.user!.id,
        req.user!.role
      );

      const httpStatus = result.valid ? 200 : 400;

      res.status(httpStatus).json({
        status: result.valid ? 'success' : 'fail',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const qrController = new QrController();
