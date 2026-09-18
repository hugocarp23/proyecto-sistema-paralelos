import { prisma } from '../config/prisma.js';

export class CategoryRepository {
  async findAll(onlyActive: boolean = false) {
    return prisma.category.findMany({
      where: onlyActive ? { active: true } : undefined,
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async create(data: { name: string; description?: string; icon?: string; active?: boolean }) {
    return prisma.category.create({
      data,
    });
  }

  async update(id: number, data: Partial<{ name: string; description?: string; icon?: string; active: boolean }>) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryRepository = new CategoryRepository();
