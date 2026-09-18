import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getProfile(req.user!.id);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await userService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Perfil actualizado exitosamente.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, roleId, active } = req.query;
      const users = await userService.getAllUsers({
        search: search as string,
        roleId: roleId ? Number(roleId) : undefined,
        active: active !== undefined ? active === 'true' : undefined,
      });

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { active } = req.body;
      const updated = await userService.updateUserStatus(Number(id), Boolean(active));
      res.status(200).json({
        status: 'success',
        message: `Estado del usuario actualizado a ${active ? 'activo' : 'inactivo'}.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { roleId } = req.body;
      const updated = await userService.updateUserRole(Number(id), Number(roleId));
      res.status(200).json({
        status: 'success',
        message: 'Rol del usuario actualizado exitosamente.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await userService.getRoles();
      res.status(200).json({
        status: 'success',
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
