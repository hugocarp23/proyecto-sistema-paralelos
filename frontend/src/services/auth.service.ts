import { api } from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../interfaces/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse['data']> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse['data']> {
    const response = await api.post('/auth/register', credentials);
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data.data;
  },

  async resetPassword(token: string, password: string, confirmPassword?: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', { token, password, confirmPassword });
    return response.data.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },
};
