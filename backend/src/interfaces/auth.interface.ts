export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roleId?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}
