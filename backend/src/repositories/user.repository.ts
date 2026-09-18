import { prisma } from '../config/prisma.js';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
    active?: boolean;
  }) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  }

  async update(id: number, data: Partial<{
    firstName: string;
    lastName: string;
    password: string;
    roleId: number;
    active: boolean;
  }>) {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  }

  async findAll(query?: { search?: string; roleId?: number; active?: boolean }) {
    const where: any = {};

    if (query?.active !== undefined) {
      where.active = query.active;
    }

    if (query?.roleId) {
      where.roleId = query.roleId;
    }

    if (query?.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return prisma.user.findMany({
      where,
      include: { role: true },
      orderBy: { id: 'asc' },
    });
  }

  async count() {
    return prisma.user.count();
  }

  // Tokens de recuperación de contraseña
  async createPasswordResetToken(userId: number, token: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findValidPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async markPasswordResetTokenUsed(id: number) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { used: true },
    });
  }
}

export const userRepository = new UserRepository();
