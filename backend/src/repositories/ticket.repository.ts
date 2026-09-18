import { prisma } from '../config/prisma.js';
import { TicketStatus } from '@prisma/client';

export class TicketRepository {
  async findById(id: number) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        event: {
          include: { category: true, organizer: true },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        attendance: {
          include: {
            validator: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async findByQrToken(qrToken: string) {
    return prisma.ticket.findUnique({
      where: { qrToken },
      include: {
        event: {
          include: { organizer: true },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        attendance: {
          include: {
            validator: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async findByTicketNumber(ticketNumber: string) {
    return prisma.ticket.findUnique({
      where: { ticketNumber },
      include: {
        event: {
          include: { organizer: true },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        attendance: {
          include: {
            validator: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.ticket.findMany({
      where: { userId },
      include: {
        event: {
          include: { category: true },
        },
        attendance: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEventId(eventId: number) {
    return prisma.ticket.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        attendance: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: TicketStatus, usedAt?: Date) {
    return prisma.ticket.update({
      where: { id },
      data: {
        status,
        ...(usedAt && { usedAt }),
      },
    });
  }

  async count(filters?: { status?: TicketStatus; organizerId?: number }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.organizerId) {
      where.event = { organizerId: filters.organizerId };
    }
    return prisma.ticket.count({ where });
  }
}

export const ticketRepository = new TicketRepository();
