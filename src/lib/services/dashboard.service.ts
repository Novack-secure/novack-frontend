import { api } from "../api";

export interface DashboardStats {
  totalEmployees: number;
  activeVisitorsToday: number;
  pendingAppointments: number;
  unreadMessages: number;
  availableCards: number;
  activeChatRooms: number;
  completedAppointmentsToday: number;
}

export interface UpcomingAppointment {
  id: string;
  visitorName: string;
  purpose: string;
  scheduledTime: string;
  status: string;
  location?: string;
  hostEmployee?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface RecentActivity {
  id: string;
  visitorName: string;
  action: string;
  time: string;
  location?: string;
}

export interface WeeklyStats {
  day: string;
  visitors: number;
  appointments: number;
  completedVisits: number;
}

export interface CardStats {
  total: number;
  active: number;
  inactive: number;
  assigned: number;
  available: number;
  averageBattery: number;
  lowBattery: number;
  criticalBattery: number;
}

export interface VisitorTrend {
  date: string;
  checkIns: number;
  checkOuts: number;
  activeVisitors: number;
}

export interface AppointmentStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  visitors: number;
  appointments: number;
  completedAppointments: number;
}

export interface HourlyActivity {
  hour: number;
  visitors: number;
  appointments: number;
}

class DashboardService {
  async getStats(supplierId?: string): Promise<DashboardStats> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<DashboardStats>("/dashboard/stats", { params });
    return response.data;
  }

  async getUpcomingAppointments(
    limit: number = 5,
    supplierId?: string
  ): Promise<UpcomingAppointment[]> {
    const params = { limit, ...(supplierId ? { supplierId } : {}) };
    const response = await api.get<UpcomingAppointment[]>("/dashboard/upcoming-appointments", { params });
    return response.data;
  }

  async getRecentActivity(
    limit: number = 10,
    supplierId?: string
  ): Promise<RecentActivity[]> {
    const params = { limit, ...(supplierId ? { supplierId } : {}) };
    const response = await api.get<RecentActivity[]>("/dashboard/recent-activity", { params });
    return response.data;
  }

  async getWeeklyStats(supplierId?: string): Promise<WeeklyStats[]> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<WeeklyStats[]>("/dashboard/weekly-stats", { params });
    return response.data;
  }

  async getCardStats(supplierId?: string): Promise<CardStats> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<CardStats>("/dashboard/card-stats", { params });
    return response.data;
  }

  async getVisitorTrends(days: number = 7, supplierId?: string): Promise<VisitorTrend[]> {
    const params = { days, ...(supplierId ? { supplierId } : {}) };
    const response = await api.get<VisitorTrend[]>("/dashboard/visitor-trends", { params });
    return response.data;
  }

  async getAppointmentStatusBreakdown(supplierId?: string): Promise<AppointmentStatus[]> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<AppointmentStatus[]>("/dashboard/appointment-status", { params });
    return response.data;
  }

  async getMonthlyTrends(months: number = 6, supplierId?: string): Promise<MonthlyTrend[]> {
    const params = { months, ...(supplierId ? { supplierId } : {}) };
    const response = await api.get<MonthlyTrend[]>("/dashboard/monthly-trends", { params });
    return response.data;
  }

  async getHourlyActivity(supplierId?: string): Promise<HourlyActivity[]> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<HourlyActivity[]>("/dashboard/hourly-activity", { params });
    return response.data;
  }
}

export const dashboardService = new DashboardService();
