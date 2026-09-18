export interface CreatePurchaseDto {
  eventId: number;
  quantity: number;
  userId?: number;
}

export interface PurchaseResponseDto {
  purchaseId: number;
  eventId: number;
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
