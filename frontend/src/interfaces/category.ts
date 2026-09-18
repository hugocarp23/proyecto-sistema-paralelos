export interface Category {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  active: boolean;
  createdAt?: string;
  _count?: {
    events: number;
  };
}
