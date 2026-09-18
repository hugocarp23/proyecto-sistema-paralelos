import { eventRepository } from '../repositories/event.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { AppError } from '../utils/appError.js';
import { CreateEventDto, UpdateEventDto, EventFilterQuery } from '../interfaces/event.interface.js';
import { EventStatus } from '@prisma/client';

export class EventService {
  async getAllEvents(filters?: EventFilterQuery) {
    return eventRepository.findAll(filters);
  }

  async getEventById(id: number) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new AppError('Evento no encontrado.', 404);
    }
    return event;
  }

  async createEvent(data: CreateEventDto, organizerId: number) {
    if (!data.title || !data.description || !data.date || !data.time || !data.location || !data.address) {
      throw new AppError('Todos los campos obligatorios del evento deben ser completados.', 400);
    }

    if (data.capacity <= 0) {
      throw new AppError('La capacidad total del evento debe ser mayor a cero.', 400);
    }

    if (data.price < 0) {
      throw new AppError('El precio de la entrada no puede ser negativo.', 400);
    }

    const category = await categoryRepository.findById(data.categoryId);
    if (!category || !category.active) {
      throw new AppError('La categoría seleccionada no existe o no está activa.', 400);
    }

    const eventDate = new Date(data.date);

    return eventRepository.create({
      title: data.title.trim(),
      description: data.description.trim(),
      image: data.image?.trim() || undefined,
      date: eventDate,
      time: data.time.trim(),
      location: data.location.trim(),
      address: data.address.trim(),
      price: Number(data.price),
      capacity: Number(data.capacity),
      availableTickets: Number(data.capacity),
      status: data.status || EventStatus.PUBLICADO,
      organizerId,
      categoryId: Number(data.categoryId),
    });
  }

  async updateEvent(id: number, data: UpdateEventDto, userId: number, userRole: string) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new AppError('Evento no encontrado.', 404);
    }

    // Comprobar que solo el organizador propietario o el admin pueden editar
    if (userRole !== 'ADMIN' && event.organizerId !== userId) {
      throw new AppError('No tienes permiso para modificar este evento.', 403);
    }

    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category || !category.active) {
        throw new AppError('La categoría seleccionada no existe o no está activa.', 400);
      }
    }

    // Si cambian la capacidad, ajustar las entradas disponibles proporcionalmente
    let newAvailableTickets = event.availableTickets;
    if (data.capacity !== undefined) {
      const diff = Number(data.capacity) - event.capacity;
      newAvailableTickets = Math.max(0, event.availableTickets + diff);
    }

    return eventRepository.update(id, {
      ...(data.title && { title: data.title.trim() }),
      ...(data.description && { description: data.description.trim() }),
      ...(data.image !== undefined && { image: data.image?.trim() || undefined }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.time && { time: data.time.trim() }),
      ...(data.location && { location: data.location.trim() }),
      ...(data.address && { address: data.address.trim() }),
      ...(data.price !== undefined && { price: Number(data.price) }),
      ...(data.capacity !== undefined && { capacity: Number(data.capacity) }),
      ...(data.availableTickets !== undefined ? { availableTickets: Number(data.availableTickets) } : (data.capacity !== undefined ? { availableTickets: newAvailableTickets } : {})),
      ...(data.status && { status: data.status }),
      ...(data.categoryId && { categoryId: Number(data.categoryId) }),
    });
  }

  async deleteEvent(id: number, userId: number, userRole: string) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new AppError('Evento no encontrado.', 404);
    }

    if (userRole !== 'ADMIN' && event.organizerId !== userId) {
      throw new AppError('No tienes permiso para eliminar este evento.', 403);
    }

    // Si ya tiene tickets vendidos, realizar eliminación lógica (CANCELADO) para mantener historial
    if (event._count.tickets > 0) {
      return eventRepository.update(id, { status: EventStatus.CANCELADO });
    }

    return eventRepository.delete(id);
  }
}

export const eventService = new EventService();
