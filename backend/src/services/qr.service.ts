import { ticketRepository } from '../repositories/ticket.repository.js';
import { attendanceRepository } from '../repositories/attendance.repository.js';
import { TicketStatus } from '@prisma/client';
import { QrValidationResult } from '../interfaces/ticket.interface.js';

export class QrService {
  /**
   * Valida un código QR o número de ticket y registra la asistencia
   */
  async validateQr(
    codeOrToken: string,
    validatorId: number,
    validatorRole: string
  ): Promise<QrValidationResult> {
    const cleanCode = codeOrToken.trim();

    if (!cleanCode) {
      return {
        valid: false,
        message: 'Código de entrada o token QR vacío.',
      };
    }

    // Buscar por qrToken o por ticketNumber (para validación manual)
    let ticket = await ticketRepository.findByQrToken(cleanCode);
    if (!ticket) {
      ticket = await ticketRepository.findByTicketNumber(cleanCode);
    }

    // 1. Comprobar que la entrada existe
    if (!ticket) {
      return {
        valid: false,
        message: '✕ ENTRADA NO ENCONTRADA: El código QR o número de ticket no existe en EventHub.',
      };
    }

    // 2. Comprobar que el organizador tenga autorización para este evento
    if (validatorRole === 'ORGANIZADOR' && ticket.event.organizerId !== validatorId) {
      return {
        valid: false,
        message: `✕ ACCESO DENEGADO: Esta entrada corresponde a otro evento ("${ticket.event.title}") que no gestionas.`,
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          event: ticket.event,
          user: ticket.user,
        },
      };
    }

    // 3. Comprobar si la entrada fue cancelada
    if (ticket.status === TicketStatus.CANCELADA) {
      return {
        valid: false,
        message: '✕ ENTRADA ANULADA: Esta entrada se encuentra CANCELADA.',
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          event: ticket.event,
          user: ticket.user,
        },
      };
    }

    // 4. Comprobar si la entrada ya fue utilizada
    if (ticket.status === TicketStatus.UTILIZADA) {
      const formattedDate = ticket.usedAt ? new Date(ticket.usedAt).toLocaleString('es-BO') : 'Previamente';
      const validatorName = ticket.attendance?.validator
        ? `${ticket.attendance.validator.firstName} ${ticket.attendance.validator.lastName}`
        : 'Organización';

      return {
        valid: false,
        message: `✕ ENTRADA YA UTILIZADA: Ingreso registrado el ${formattedDate} por ${validatorName}.`,
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          event: ticket.event,
          user: ticket.user,
          usedAt: ticket.usedAt,
        },
        attendance: ticket.attendance
          ? {
              id: ticket.attendance.id,
              validatedAt: ticket.attendance.validatedAt,
              validatedBy: ticket.attendance.validatedBy,
              validatorName,
            }
          : undefined,
      };
    }

    // 5. La entrada es ACTIVA y VÁLIDA -> Registrar asistencia y marcar como UTILIZADA
    const now = new Date();
    await ticketRepository.updateStatus(ticket.id, TicketStatus.UTILIZADA, now);

    const attendance = await attendanceRepository.record({
      ticketId: ticket.id,
      validatedBy: validatorId,
      notes: 'Validación por lector QR / acceso',
    });

    return {
      valid: true,
      message: `✓ ENTRADA VÁLIDA: Acceso concedido a ${ticket.user.firstName} ${ticket.user.lastName} para "${ticket.event.title}".`,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: TicketStatus.UTILIZADA,
        event: ticket.event,
        user: ticket.user,
        usedAt: now,
      },
      attendance: {
        id: attendance.id,
        validatedAt: attendance.validatedAt,
        validatedBy: validatorId,
        validatorName: `${attendance.validator.firstName} ${attendance.validator.lastName}`,
      },
    };
  }
}

export const qrService = new QrService();
