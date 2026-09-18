import { Ticket } from './ticket';
import { EventItem } from './event';

export interface Purchase {
  id: number;
  userId: number;
  total: number;
  status: 'COMPLETADA' | 'PENDIENTE' | 'CANCELADA';
  createdAt: string;
  tickets: Ticket[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PurchaseResult {
  status: string;
  success: boolean;
  message: string;
  purchaseId: number;
  eventTitle: string;
  quantity: number;
  total: number;
  tickets: Array<{
    ticketId: number;
    ticketNumber: string;
    qrToken: string;
    status: string;
  }>;
}
