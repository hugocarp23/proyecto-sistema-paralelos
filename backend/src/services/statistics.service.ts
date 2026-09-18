import { reportRepository } from '../repositories/report.repository.js';

export class StatisticsService {
  async getDashboardStatistics(userId: number, userRole: string) {
    if (userRole === 'ORGANIZADOR') {
      return reportRepository.getDashboardStats(userId);
    }
    // Para ADMIN devuelve estadísticas globales
    return reportRepository.getDashboardStats();
  }
}

export const statisticsService = new StatisticsService();
