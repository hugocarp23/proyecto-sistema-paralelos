import { purchaseRepository } from '../repositories/purchase.repository.js';
import { eventRepository } from '../repositories/event.repository.js';
import { generateSecureQrToken, generateTicketNumber } from '../utils/qrToken.js';
import { AppError } from '../utils/appError.js';
import { CreatePurchaseDto } from '../interfaces/purchase.interface.js';
import { EventStatus } from '@prisma/client';

export class PurchaseService {
  async processPurchase(data: CreatePurchaseDto, userId: number) {
    const { eventId, quantity } = data;

    if (!eventId || !quantity || quantity <= 0) {
      throw new AppError('Debes seleccionar al menos una entrada válida para comprar.', 400);
    }

    if (quantity > 10) {
      throw new AppError('El límite máximo por compra es de 10 entradas por transacción.', 400);
    }

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new AppError('El evento seleccionado no existe.', 404);
    }

    if (event.status !== EventStatus.PUBLICADO) {
      throw new AppError(`El evento no está disponible para compra (Estado: ${event.status}).`, 400);
    }

    if (event.availableTickets < quantity) {
      throw new AppError(
        `Disponibilidad insuficiente. Solicitadas: ${quantity}, disponibles: ${event.availableTickets}.`,
        400
      );
    }

    const total = event.price * quantity;

    // Generar datos únicos para cada ticket
    const ticketsData = [];
    for (let i = 0; i < quantity; i++) {
      ticketsData.push({
        qrToken: generateSecureQrToken(),
        ticketNumber: generateTicketNumber(),
      });
    }

    try {
      const result = await purchaseRepository.createWithTickets({
        userId,
        eventId,
        quantity,
        total,
        ticketsData,
      });

      return {
        success: true,
        message: '¡Compra realizada con éxito! Tus entradas y códigos QR están disponibles en tu billetera digital.',
        purchaseId: result.purchase.id,
        eventTitle: event.title,
        quantity,
        total,
        tickets: result.tickets.map((t) => ({
          ticketId: t.id,
          ticketNumber: t.ticketNumber,
          qrToken: t.qrToken,
          status: t.status,
        })),
      };
    } catch (error: any) {
      if (error.message === 'ENTRADAS_AGOTADAS') {
        throw new AppError('Lo sentimos, las entradas acaban de agotarse para este evento.', 400);
      }
      throw error;
    }
  }

  async getUserPurchases(userId: number) {
    return purchaseRepository.findByUserId(userId);
  }

  async getPurchaseById(purchaseId: number, userId: number, userRole: string) {
    const purchase = await purchaseRepository.findById(purchaseId);
    if (!purchase) {
      throw new AppError('Compra no encontrada.', 404);
    }

    if (userRole !== 'ADMIN' && purchase.userId !== userId) {
      throw new AppError('No tienes permiso para consultar esta compra.', 403);
    }

    return purchase;
  }

  async getAllPurchases(userId: number, userRole: string) {
    if (userRole === 'ORGANIZADOR') {
      return purchaseRepository.findAll({ organizerId: userId });
    }
    return purchaseRepository.findAll();
  }
}

export const purchaseService = new PurchaseService();
