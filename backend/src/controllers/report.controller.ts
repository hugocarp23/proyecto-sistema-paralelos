import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service.js';
import { ReportType } from '../interfaces/report.interface.js';

export class ReportController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, eventId, startDate, endDate } = req.query;

      const report = await reportService.generateReport(
        {
          type: (type as ReportType) || 'ventas',
          eventId: eventId ? Number(eventId) : undefined,
          startDate: startDate as string,
          endDate: endDate as string,
        },
        req.user!.id,
        req.user!.role
      );

      res.status(200).json({
        status: 'success',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
