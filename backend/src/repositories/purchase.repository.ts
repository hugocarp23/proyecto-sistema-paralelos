import { prisma } from '../config/prisma.js';
import { PurchaseStatus, TicketStatus } from '@prisma/client';

export class PurchaseRepository {
  async findById(id: number) {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        tickets: {
          include: {
            event: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.purchase.findMany({
      where: { userId },
      include: {
        tickets: {
          include: {
            event: {
              include: { category: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Ejecuta la compra atómica:
   * 1. Verifica disponibilidad suficiente
   * 2. Descuenta 'quantity' entradas disponibles del evento
   * 3. Crea la compra
   * 4. Crea cada uno de los tickets con su token QR y número único
   */
  async createWithTickets(params: {
    userId: number;
    eventId: number;
    quantity: number;
    total: number;
    ticketsData: Array<{ qrToken: string; ticketNumber: string }>;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Decrementar disponibilidad de manera atómica
      const updatedEvent = await tx.event.update({
        where: { id: params.eventId },
        data: {
          availableTickets: { decrement: params.quantity },
        },
      });

      if (updatedEvent.availableTickets < 0) {
        throw new Error('ENTRADAS_AGOTADAS');
      }

      // 2. Crear compra
      const purchase = await tx.purchase.create({
        data: {
          userId: params.userId,
          total: params.total,
          status: PurchaseStatus.COMPLETADA,
        },
      });

      // 3. Crear tickets
      const createdTickets = [];
      for (const t of params.ticketsData) {
        const ticket = await tx.ticket.create({
          data: {
            purchaseId: purchase.id,
            eventId: params.eventId,
            userId: params.userId,
            qrToken: t.qrToken,
            ticketNumber: t.ticketNumber,
            status: TicketStatus.ACTIVA,
          },
        });
        createdTickets.push(ticket);
      }

      return {
        purchase,
        event: updatedEvent,
        tickets: createdTickets,
      };
    });
  }

  async findAll(query?: { organizerId?: number }) {
    if (query?.organizerId) {
      return prisma.purchase.findMany({
        where: {
          tickets: {
            some: {
              event: { organizerId: query.organizerId },
            },
          },
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          tickets: {
            include: { event: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.purchase.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        tickets: {
          include: { event: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const purchaseRepository = new PurchaseRepository();
