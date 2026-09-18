import { EventStatus } from '@prisma/client';

export interface CreateEventDto {
  title: string;
  description: string;
  image?: string;
  date: string | Date;
  time: string;
  location: string;
  address: string;
  price: number;
  capacity: number;
  categoryId: number;
  status?: EventStatus;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  image?: string;
  date?: string | Date;
  time?: string;
  location?: string;
  address?: string;
  price?: number;
  capacity?: number;
  availableTickets?: number;
  categoryId?: number;
  status?: EventStatus;
}

export interface EventFilterQuery {
  search?: string;
  category?: string | number;
  location?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: EventStatus;
  organizerId?: number;
  limit?: number;
  page?: number;
}
