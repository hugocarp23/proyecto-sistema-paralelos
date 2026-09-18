import { prisma } from '../config/prisma.js';
import { EventStatus, Prisma } from '@prisma/client';
import { EventFilterQuery } from '../interfaces/event.interface.js';

export class EventRepository {
  async findAll(filters?: EventFilterQuery) {
    const where: Prisma.EventWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.organizerId) {
      where.organizerId = filters.organizerId;
    }

    if (filters?.category) {
      if (typeof filters.category === 'number' || !isNaN(Number(filters.category))) {
        where.categoryId = Number(filters.category);
      } else {
        where.category = {
          name: { equals: String(filters.category), mode: 'insensitive' },
        };
      }
    }

    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { tickets: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { tickets: true },
        },
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    image?: string;
    date: Date;
    time: string;
    location: string;
    address: string;
    price: number;
    capacity: number;
    availableTickets: number;
    status?: EventStatus;
    organizerId: number;
    categoryId: number;
  }) {
    return prisma.event.create({
      data,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<{
    title: string;
    description: string;
    image?: string;
    date: Date;
    time: string;
    location: string;
    address: string;
    price: number;
    capacity: number;
    availableTickets: number;
    status: EventStatus;
    categoryId: number;
  }>) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return prisma.event.delete({
      where: { id },
    });
  }

  async count(filters?: { organizerId?: number; status?: EventStatus }) {
    return prisma.event.count({
      where: filters,
    });
  }
}

export const eventRepository = new EventRepository();
