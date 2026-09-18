import { api } from './api';

export const attendanceService = {
  async getAll(eventId?: number) {
    const response = await api.get('/attendance', {
      params: { eventId },
    });
    return response.data.data;
  },
};
