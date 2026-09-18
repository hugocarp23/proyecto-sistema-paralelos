import { userRepository } from '../repositories/user.repository.js';
import { roleRepository } from '../repositories/role.repository.js';
import { AppError } from '../utils/appError.js';
import { hashPassword } from '../utils/password.js';

export class UserService {
  async getProfile(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      active: user.active,
      createdAt: user.createdAt,
    };
  }

  async getAllUsers(filters?: { search?: string; roleId?: number; active?: boolean }) {
    const users = await userRepository.findAll(filters);
    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role.name,
      roleId: u.roleId,
      active: u.active,
      createdAt: u.createdAt,
    }));
  }

  async updateUserStatus(userId: number, active: boolean) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    const updated = await userRepository.update(userId, { active });
    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      active: updated.active,
      role: updated.role.name,
    };
  }

  async updateUserRole(userId: number, roleId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new AppError('El rol especificado no existe.', 400);
    }

    const updated = await userRepository.update(userId, { roleId });
    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      role: updated.role.name,
    };
  }

  async updateProfile(userId: number, data: { firstName?: string; lastName?: string; password?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    const updateData: any = {};
    if (data.firstName) updateData.firstName = data.firstName.trim();
    if (data.lastName) updateData.lastName = data.lastName.trim();
    if (data.password) {
      if (data.password.length < 6) {
        throw new AppError('La nueva contraseña debe tener al menos 6 caracteres.', 400);
      }
      updateData.password = await hashPassword(data.password);
    }

    const updated = await userRepository.update(userId, updateData);
    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      role: updated.role.name,
    };
  }

  async getRoles() {
    return roleRepository.findAll();
  }
}

export const userService = new UserService();
