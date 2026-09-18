import { api } from './api';
import { DashboardStats } from '../interfaces/report';

export const statisticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/statistics');
    return response.data.data;
  },
};
