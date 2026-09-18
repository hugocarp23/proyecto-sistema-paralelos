import { categoryRepository } from '../repositories/category.repository.js';
import { AppError } from '../utils/appError.js';

export class CategoryService {
  async getAllCategories(onlyActive: boolean = false) {
    return categoryRepository.findAll(onlyActive);
  }

  async getCategoryById(id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Categoría no encontrada.', 404);
    }
    return category;
  }

  async createCategory(data: { name: string; description?: string; icon?: string }) {
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError('El nombre de la categoría es obligatorio.', 400);
    }

    const existing = await categoryRepository.findByName(data.name.trim());
    if (existing) {
      throw new AppError('Ya existe una categoría con ese nombre.', 400);
    }

    return categoryRepository.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      icon: data.icon || 'Sparkles',
      active: true,
    });
  }

  async updateCategory(id: number, data: { name?: string; description?: string; icon?: string; active?: boolean }) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Categoría no encontrada.', 404);
    }

    if (data.name && data.name.trim() !== category.name) {
      const existing = await categoryRepository.findByName(data.name.trim());
      if (existing && existing.id !== id) {
        throw new AppError('Ya existe otra categoría con ese nombre.', 400);
      }
    }

    return categoryRepository.update(id, {
      ...(data.name && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() }),
      ...(data.icon && { icon: data.icon }),
      ...(data.active !== undefined && { active: data.active }),
    });
  }

  async deleteCategory(id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Categoría no encontrada.', 404);
    }

    if (category._count.events > 0) {
      // Si tiene eventos asociados, se desactiva lógicamente para preservar integridad referencial
      return categoryRepository.update(id, { active: false });
    }

    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
