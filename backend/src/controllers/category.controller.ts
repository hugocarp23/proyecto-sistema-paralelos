import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';

export class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const onlyActive = req.query.active === 'true';
      const categories = await categoryService.getAllCategories(onlyActive);
      res.status(200).json({
        status: 'success',
        results: categories.length,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.getCategoryById(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Categoría creada exitosamente.',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await categoryService.updateCategory(Number(req.params.id), req.body);
      res.status(200).json({
        status: 'success',
        message: 'Categoría actualizada exitosamente.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.deleteCategory(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        message: 'Categoría eliminada o desactivada exitosamente.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
