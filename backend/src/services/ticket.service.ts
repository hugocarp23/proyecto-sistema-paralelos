import { ticketRepository } from '../repositories/ticket.repository.js';
import { AppError } from '../utils/appError.js';

export class TicketService {
  async getMyTickets(userId: number) {
    return ticketRepository.findByUserId(userId);
  }

  async getTicketById(ticketId: number, userId: number, userRole: string) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Entrada no encontrada.', 404);
    }

    // Regla: un usuario normal solo ve sus entradas; organizador ve las de sus eventos; admin ve todas
    if (userRole === 'USUARIO' && ticket.userId !== userId) {
      throw new AppError('No tienes permiso para consultar esta entrada.', 403);
    }

    if (userRole === 'ORGANIZADOR' && ticket.event.organizerId !== userId) {
      throw new AppError('No tienes permiso para consultar entradas de este evento.', 403);
    }

    return ticket;
  }

  async getTicketsByEvent(eventId: number, userId: number, userRole: string) {
    if (userRole === 'ORGANIZADOR') {
      const tickets = await ticketRepository.findByEventId(eventId);
      return tickets;
    }
    return ticketRepository.findByEventId(eventId);
  }
}

export const ticketService = new TicketService();
