import { api } from './api';
import { QrValidationResponse } from '../interfaces/ticket';

export const qrService = {
  async validate(codeOrToken: string): Promise<QrValidationResponse> {
    const response = await api.post('/qr/validate', { code: codeOrToken });
    return response.data;
  },
};
