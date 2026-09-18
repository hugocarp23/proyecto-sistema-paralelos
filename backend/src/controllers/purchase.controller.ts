import { Request, Response, NextFunction } from 'express';
import { purchaseService } from '../services/purchase.service.js';

export class PurchaseController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await purchaseService.processPurchase(req.body, req.user!.id);
      res.status(201).json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyPurchases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchases = await purchaseService.getUserPurchases(req.user!.id);
      res.status(200).json({
        status: 'success',
        results: purchases.length,
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchase = await purchaseService.getPurchaseById(
        Number(req.params.id),
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        status: 'success',
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchases = await purchaseService.getAllPurchases(req.user!.id, req.user!.role);
      res.status(200).json({
        status: 'success',
        results: purchases.length,
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const purchaseController = new PurchaseController();
