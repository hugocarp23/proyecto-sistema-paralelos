import { prisma } from '../config/prisma.js';
import { EventStatus, TicketStatus } from '@prisma/client';

export class ReportRepository {
  async getDashboardStats(organizerId?: number) {
    const eventWhere: any = {};
    const ticketWhere: any = {};
    const attendanceWhere: any = {};

    if (organizerId) {
      eventWhere.organizerId = organizerId;
      ticketWhere.event = { organizerId };
      attendanceWhere.ticket = { event: { organizerId } };
    }

    const [
      totalEvents,
      activeEvents,
      totalTicketsSold,
      usedTickets,
      events,
    ] = await Promise.all([
      prisma.event.count({ where: eventWhere }),
      prisma.event.count({ where: { ...eventWhere, status: EventStatus.PUBLICADO } }),
      prisma.ticket.count({ where: ticketWhere }),
      prisma.attendance.count({ where: attendanceWhere }),
      prisma.event.findMany({
        where: eventWhere,
        select: {
          id: true,
          title: true,
          price: true,
          capacity: true,
          availableTickets: true,
          _count: {
            select: { tickets: true },
          },
        },
        orderBy: {
          tickets: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Calcular ingresos y capacidad
    let totalRevenue = 0;
    let totalCapacity = 0;
    let totalAvailableTickets = 0;

    const allEvents = await prisma.event.findMany({
      where: eventWhere,
      select: {
        price: true,
        capacity: true,
        availableTickets: true,
        _count: { select: { tickets: true } },
      },
    });

    for (const ev of allEvents) {
      totalRevenue += ev.price * ev._count.tickets;
      totalCapacity += ev.capacity;
      totalAvailableTickets += ev.availableTickets;
    }

    const attendanceRate = totalTicketsSold > 0 ? (usedTickets / totalTicketsSold) * 100 : 0;

    const topEvents = events.map((ev) => ({
      id: ev.id,
      title: ev.title,
      soldTickets: ev._count.tickets,
      revenue: ev.price * ev._count.tickets,
    }));

    return {
      totalEvents,
      activeEvents,
      totalTicketsSold,
      totalRevenue,
      totalAttendees: usedTickets,
      totalAvailableTickets,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      topEvents,
    };
  }

  async getSalesReport(filters: { organizerId?: number; eventId?: number; startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    if (filters.eventId || filters.organizerId) {
      where.tickets = {
        some: {
          ...(filters.eventId && { eventId: filters.eventId }),
          ...(filters.organizerId && { event: { organizerId: filters.organizerId } }),
        },
      };
    }

    return prisma.purchase.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        tickets: {
          include: {
            event: { select: { id: true, title: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAttendanceReport(filters: { organizerId?: number; eventId?: number; startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.validatedAt = {};
      if (filters.startDate) where.validatedAt.gte = filters.startDate;
      if (filters.endDate) where.validatedAt.lte = filters.endDate;
    }

    if (filters.eventId) {
      where.ticket = { eventId: filters.eventId };
    }

    if (filters.organizerId) {
      where.ticket = {
        ...(where.ticket || {}),
        event: { organizerId: filters.organizerId },
      };
    }

    return prisma.attendance.findMany({
      where,
      include: {
        validator: { select: { id: true, firstName: true, lastName: true } },
        ticket: {
          include: {
            event: { select: { id: true, title: true, date: true, time: true, location: true } },
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { validatedAt: 'desc' },
    });
  }
}

export const reportRepository = new ReportRepository();
