import { Request, Response, NextFunction } from 'express';
import { statisticsService } from '../services/statistics.service.js';

export class StatisticsController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await statisticsService.getDashboardStatistics(req.user!.id, req.user!.role);
      res.status(200).json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const statisticsController = new StatisticsController();
