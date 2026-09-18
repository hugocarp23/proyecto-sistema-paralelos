import { api } from './api';
import { EventItem, CreateEventPayload } from '../interfaces/event';

export const eventService = {
  async getAll(params?: {
    search?: string;
    category?: string | number;
    location?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    organizerId?: number;
  }): Promise<EventItem[]> {
    const response = await api.get('/events', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<EventItem> {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  async create(data: CreateEventPayload): Promise<EventItem> {
    const response = await api.post('/events', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateEventPayload>): Promise<EventItem> {
    const response = await api.put(`/events/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
