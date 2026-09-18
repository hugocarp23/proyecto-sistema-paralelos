import { EventItem } from './event';
import { User } from './auth';

export type TicketStatus = 'ACTIVA' | 'UTILIZADA' | 'CANCELADA';

export interface Ticket {
  id: number;
  purchaseId: number;
  eventId: number;
  userId: number;
  qrToken: string;
  ticketNumber: string;
  status: TicketStatus;
  usedAt?: string | null;
  createdAt: string;
  event: EventItem;
  user?: User;
  attendance?: {
    id: number;
    validatedAt: string;
    validatedBy: number;
    validator?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
}

export interface QrValidationResponse {
  status: 'success' | 'fail';
  valid: boolean;
  message: string;
  ticket?: {
    id: number;
    ticketNumber: string;
    status: TicketStatus;
    event: {
      id: number;
      title: string;
      date: string;
      time: string;
      location: string;
      address: string;
    };
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
    usedAt?: string | null;
  };
  attendance?: {
    id: number;
    validatedAt: string;
    validatedBy: number;
    validatorName: string;
  };
}
