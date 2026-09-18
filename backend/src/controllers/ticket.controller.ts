import { Request, Response, NextFunction } from 'express';
import { ticketService } from '../services/ticket.service.js';

export class TicketController {
  async getMyTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tickets = await ticketService.getMyTickets(req.user!.id);
      res.status(200).json({
        status: 'success',
        results: tickets.length,
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await ticketService.getTicketById(
        Number(req.params.id),
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        status: 'success',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tickets = await ticketService.getTicketsByEvent(
        Number(req.params.eventId),
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        status: 'success',
        results: tickets.length,
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const ticketController = new TicketController();
