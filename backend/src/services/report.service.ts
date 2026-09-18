import { reportRepository } from '../repositories/report.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { ticketRepository } from '../repositories/ticket.repository.js';
import { eventRepository } from '../repositories/event.repository.js';
import { ReportFilterDto } from '../interfaces/report.interface.js';

export class ReportService {
  async generateReport(filters: ReportFilterDto, userId: number, userRole: string) {
    const organizerId = userRole === 'ORGANIZADOR' ? userId : undefined;
    const startDate = filters.startDate ? new Date(filters.startDate) : undefined;
    const endDate = filters.endDate ? new Date(filters.endDate) : undefined;
    const eventId = filters.eventId ? Number(filters.eventId) : undefined;

    switch (filters.type) {
      case 'ventas':
      case 'ingresos': {
        const sales = await reportRepository.getSalesReport({
          organizerId,
          eventId,
          startDate,
          endDate,
        });

        const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
        const totalTickets = sales.reduce((acc, s) => acc + s.tickets.length, 0);

        return {
          type: filters.type,
          filters: { startDate, endDate, eventId },
          summary: {
            totalOrders: sales.length,
            totalTickets,
            totalRevenue,
          },
          data: sales.map((s) => ({
            orderId: s.id,
            date: s.createdAt,
            customer: `${s.user.firstName} ${s.user.lastName}`,
            email: s.user.email,
            ticketsCount: s.tickets.length,
            eventTitle: s.tickets[0]?.event.title || 'Varios',
            total: s.total,
            status: s.status,
          })),
        };
      }

      case 'asistencia': {
        const attendances = await reportRepository.getAttendanceReport({
          organizerId,
          eventId,
          startDate,
          endDate,
        });

        return {
          type: 'asistencia',
          filters: { startDate, endDate, eventId },
          summary: {
            totalAttendees: attendances.length,
          },
          data: attendances.map((a) => ({
            id: a.id,
            ticketNumber: a.ticket.ticketNumber,
            eventTitle: a.ticket.event.title,
            eventLocation: a.ticket.event.location,
            customer: `${a.ticket.user.firstName} ${a.ticket.user.lastName}`,
            validatedAt: a.validatedAt,
            validator: `${a.validator.firstName} ${a.validator.lastName}`,
          })),
        };
      }

      case 'entradas': {
        let tickets;
        if (eventId) {
          tickets = await ticketRepository.findByEventId(eventId);
        } else if (organizerId) {
          const events = await eventRepository.findAll({ organizerId });
          const eventIds = events.map((e) => e.id);
          const allTickets = [];
          for (const eid of eventIds) {
            const tkts = await ticketRepository.findByEventId(eid);
            allTickets.push(...tkts);
          }
          tickets = allTickets;
        } else {
          tickets = await ticketRepository.findByEventId(eventId || 1); // sample
        }

        return {
          type: 'entradas',
          summary: {
            totalTickets: tickets.length,
            activeTickets: tickets.filter((t) => t.status === 'ACTIVA').length,
            usedTickets: tickets.filter((t) => t.status === 'UTILIZADA').length,
            cancelledTickets: tickets.filter((t) => t.status === 'CANCELADA').length,
          },
          data: tickets,
        };
      }

      case 'usuarios': {
        const users = await userRepository.findAll();
        return {
          type: 'usuarios',
          summary: {
            totalUsers: users.length,
            activeUsers: users.filter((u) => u.active).length,
          },
          data: users.map((u) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role.name,
            active: u.active,
            registeredAt: u.createdAt,
          })),
        };
      }

      default:
        return {
          type: 'general',
          data: [],
        };
    }
  }
}

export const reportService = new ReportService();
