import { api } from './api';
import { ReportData } from '../interfaces/report';

export const reportService = {
  async generate(params: {
    type: string;
    eventId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ReportData> {
    const response = await api.get('/reports', { params });
    return response.data.data;
  },
};
