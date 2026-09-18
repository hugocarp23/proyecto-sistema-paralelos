import { prisma } from '../config/prisma.js';

export class RoleRepository {
  async findByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  async findById(id: number) {
    return prisma.role.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
  }
}

export const roleRepository = new RoleRepository();
