import { TicketStatus } from '@prisma/client';

export interface ValidateQrDto {
  qrToken: string;
}

export interface QrValidationResult {
  valid: boolean;
  message: string;
  ticket?: {
    id: number;
    ticketNumber: string;
    status: TicketStatus;
    event: {
      id: number;
      title: string;
      date: Date;
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
    usedAt?: Date | null;
  };
  attendance?: {
    id: number;
    validatedAt: Date;
    validatedBy: number;
    validatorName: string;
  };
}
