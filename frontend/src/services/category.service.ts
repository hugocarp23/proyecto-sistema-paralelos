import { api } from './api';
import { Category } from '../interfaces/category';

export const categoryService = {
  async getAll(activeOnly: boolean = false): Promise<Category[]> {
    const response = await api.get('/categories', {
      params: { active: activeOnly ? 'true' : undefined },
    });
    return response.data.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  async create(data: { name: string; description?: string; icon?: string }): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  async update(id: number, data: { name?: string; description?: string; icon?: string; active?: boolean }): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
