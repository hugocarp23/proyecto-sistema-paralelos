export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalAttendees: number;
  totalAvailableTickets: number;
  attendanceRate: number;
  topEvents: Array<{
    id: number;
    title: string;
    soldTickets: number;
    revenue: number;
  }>;
}

export interface ReportData {
  type: string;
  filters?: {
    startDate?: string;
    endDate?: string;
    eventId?: number;
  };
  summary?: Record<string, any>;
  data: any[];
}
