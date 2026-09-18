import { api } from './api';
import { Ticket } from '../interfaces/ticket';

export const ticketService = {
  async getMyTickets(): Promise<Ticket[]> {
    const response = await api.get('/tickets/my');
    return response.data.data;
  },

  async getById(id: number): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data.data;
  },

  async getByEvent(eventId: number): Promise<Ticket[]> {
    const response = await api.get(`/tickets/event/${eventId}`);
    return response.data.data;
  },
};
