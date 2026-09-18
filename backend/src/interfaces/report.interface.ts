export type ReportType = 'ventas' | 'entradas' | 'asistencia' | 'ingresos' | 'usuarios';

export interface ReportFilterDto {
  type: ReportType;
  eventId?: number;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStatsDto {
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
