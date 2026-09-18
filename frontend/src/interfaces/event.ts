import { Category } from './category';

export type EventStatus = 'BORRADOR' | 'PUBLICADO' | 'FINALIZADO' | 'CANCELADO';

export interface EventItem {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  capacity: number;
  availableTickets: number;
  status: EventStatus;
  organizerId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  organizer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    tickets: number;
  };
}

export interface CreateEventPayload {
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  capacity: number;
  categoryId: number;
  status?: EventStatus;
}
