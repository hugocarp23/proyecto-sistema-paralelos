import { prisma } from '../config/prisma.js';

export class AttendanceRepository {
  async record(data: { ticketId: number; validatedBy: number; notes?: string }) {
    return prisma.attendance.create({
      data: {
        ticketId: data.ticketId,
        validatedBy: data.validatedBy,
        notes: data.notes,
      },
      include: {
        validator: {
          select: { id: true, firstName: true, lastName: true },
        },
        ticket: {
          include: {
            event: true,
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  async findByTicketId(ticketId: number) {
    return prisma.attendance.findUnique({
      where: { ticketId },
      include: {
        validator: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findAll(query?: { eventId?: number; organizerId?: number }) {
    const where: any = {};

    if (query?.eventId) {
      where.ticket = { eventId: query.eventId };
    }

    if (query?.organizerId) {
      where.ticket = {
        ...(where.ticket || {}),
        event: { organizerId: query.organizerId },
      };
    }

    return prisma.attendance.findMany({
      where,
      include: {
        validator: {
          select: { id: true, firstName: true, lastName: true },
        },
        ticket: {
          include: {
            event: true,
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
      orderBy: { validatedAt: 'desc' },
    });
  }

  async count(filters?: { organizerId?: number }) {
    const where: any = {};
    if (filters?.organizerId) {
      where.ticket = { event: { organizerId: filters.organizerId } };
    }
    return prisma.attendance.count({ where });
  }
}

export const attendanceRepository = new AttendanceRepository();
