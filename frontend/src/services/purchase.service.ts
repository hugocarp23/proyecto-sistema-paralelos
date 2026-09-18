import { api } from './api';
import { Purchase, PurchaseResult } from '../interfaces/purchase';

export const purchaseService = {
  async create(eventId: number, quantity: number): Promise<PurchaseResult> {
    const response = await api.post('/purchases', { eventId, quantity });
    return response.data;
  },

  async getMyPurchases(): Promise<Purchase[]> {
    const response = await api.get('/purchases/my');
    return response.data.data;
  },

  async getById(id: number): Promise<Purchase> {
    const response = await api.get(`/purchases/${id}`);
    return response.data.data;
  },

  async getAll(): Promise<Purchase[]> {
    const response = await api.get('/purchases');
    return response.data.data;
  },
};
