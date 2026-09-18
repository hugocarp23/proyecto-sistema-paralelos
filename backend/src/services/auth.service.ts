import { userRepository } from '../repositories/user.repository.js';
import { roleRepository } from '../repositories/role.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';
import { RegisterUserDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from '../interfaces/auth.interface.js';
import crypto from 'crypto';

export class AuthService {
  async register(data: RegisterUserDto) {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new AppError('Todos los campos obligatorios deben ser completados.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('El formato del correo electrónico no es válido.', 400);
    }

    if (data.password.length < 6) {
      throw new AppError('La contraseña debe tener al menos 6 caracteres.', 400);
    }

    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new AppError('Las contraseñas no coinciden.', 400);
    }

    const existingUser = await userRepository.findByEmail(data.email.toLowerCase().trim());
    if (existingUser) {
      throw new AppError('El correo electrónico ya se encuentra registrado en EventHub.', 400);
    }

    // Por defecto rol USUARIO (id 3) a menos que se especifique
    let roleId = data.roleId || 3;
    const role = await roleRepository.findById(roleId);
    if (!role) {
      roleId = 3;
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await userRepository.create({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      roleId,
      active: true,
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role.name,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });

    return {
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role.name,
      },
      token,
    };
  }

  async login(data: LoginDto) {
    if (!data.email || !data.password) {
      throw new AppError('Por favor ingresa tu correo y contraseña.', 400);
    }

    const user = await userRepository.findByEmail(data.email.toLowerCase().trim());
    if (!user) {
      throw new AppError('Credenciales incorrectas.', 401);
    }

    if (!user.active) {
      throw new AppError('Tu cuenta se encuentra suspendida o inactiva. Contacta al administrador.', 403);
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Credenciales incorrectas.', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
      token,
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    if (!data.email) {
      throw new AppError('El correo es obligatorio.', 400);
    }

    const user = await userRepository.findByEmail(data.email.toLowerCase().trim());
    if (!user) {
      // Para seguridad no revelamos si existe o no
      return {
        message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.',
      };
    }

    // Generar token seguro con expiración de 1 hora
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.createPasswordResetToken(user.id, resetToken, expiresAt);

    return {
      message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.',
      resetToken, // Se devuelve para facilitar pruebas académicas locales
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    if (!data.token || !data.password) {
      throw new AppError('Token y contraseña son requeridos.', 400);
    }

    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new AppError('Las contraseñas no coinciden.', 400);
    }

    const resetRecord = await userRepository.findValidPasswordResetToken(data.token);
    if (!resetRecord) {
      throw new AppError('El token de restablecimiento es inválido o ha expirado.', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    await userRepository.update(resetRecord.userId, { password: hashedPassword });
    await userRepository.markPasswordResetTokenUsed(resetRecord.id);

    return {
      message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión con tu nueva clave.',
    };
  }
}

export const authService = new AuthService();
