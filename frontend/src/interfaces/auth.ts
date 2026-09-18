export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'ORGANIZADOR' | 'USUARIO' | string;
  roleId?: number;
  active?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  status: string;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roleId?: number;
}
