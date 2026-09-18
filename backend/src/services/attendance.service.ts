import { attendanceRepository } from '../repositories/attendance.repository.js';

export class AttendanceService {
  async getAttendanceList(userId: number, userRole: string, eventId?: number) {
    if (userRole === 'ORGANIZADOR') {
      return attendanceRepository.findAll({ organizerId: userId, eventId });
    }
    return attendanceRepository.findAll({ eventId });
  }
}

export const attendanceService = new AttendanceService();
