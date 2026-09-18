import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/event.service.js';
import { EventStatus } from '@prisma/client';

export class EventController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, location, date, minPrice, maxPrice, status, organizerId } = req.query;

      const events = await eventService.getAllEvents({
        search: search as string,
        category: category as string,
        location: location as string,
        date: date as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        status: status as EventStatus,
        organizerId: organizerId ? Number(organizerId) : undefined,
      });

      res.status(200).json({
        status: 'success',
        results: events.length,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.getEventById(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.createEvent(req.body, req.user!.id);
      res.status(201).json({
        status: 'success',
        message: 'Evento creado exitosamente.',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await eventService.updateEvent(
        Number(req.params.id),
        req.body,
        req.user!.id,
        req.user!.role
      );
      res.status(200).json({
        status: 'success',
        message: 'Evento actualizado exitosamente.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await eventService.deleteEvent(Number(req.params.id), req.user!.id, req.user!.role);
      res.status(200).json({
        status: 'success',
        message: 'Evento eliminado o cancelado exitosamente.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
