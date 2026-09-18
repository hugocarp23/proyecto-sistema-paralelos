import { api } from './api';
import { User } from '../interfaces/auth';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  async updateProfile(data: { firstName?: string; lastName?: string; password?: string }): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  },

  async getAllUsers(params?: { search?: string; roleId?: number; active?: boolean }): Promise<User[]> {
    const response = await api.get('/users', { params });
    return response.data.data;
  },

  async updateUserStatus(id: number, active: boolean): Promise<User> {
    const response = await api.patch(`/users/${id}/status`, { active });
    return response.data.data;
  },

  async updateUserRole(id: number, roleId: number): Promise<User> {
    const response = await api.patch(`/users/${id}/role`, { roleId });
    return response.data.data;
  },

  async getRoles(): Promise<Array<{ id: number; name: string }>> {
    const response = await api.get('/users/roles');
    return response.data.data;
  },
};
