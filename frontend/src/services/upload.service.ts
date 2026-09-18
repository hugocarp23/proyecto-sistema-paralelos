import { api } from './api';

export interface UploadResponse {
  status: string;
  message: string;
  data: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}

export const uploadService = {
  /**
   * Sube una imagen al servidor backend
   * @param file Archivo File obtenido del input[type="file"]
   * @returns URL accesible de la imagen subida
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  },
};
