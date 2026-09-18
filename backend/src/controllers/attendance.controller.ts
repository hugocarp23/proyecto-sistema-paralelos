import { Request, Response, NextFunction } from 'express';
import { attendanceService } from '../services/attendance.service.js';

export class AttendanceController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId } = req.query;
      const list = await attendanceService.getAttendanceList(
        req.user!.id,
        req.user!.role,
        eventId ? Number(eventId) : undefined
      );

      res.status(200).json({
        status: 'success',
        results: list.length,
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const attendanceController = new AttendanceController();
