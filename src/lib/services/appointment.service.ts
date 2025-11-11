import { api } from "../api";

export interface Appointment {
  id: string;
  title?: string;
  description?: string;
  scheduled_time: string;
  check_in_time?: string;
  check_out_time?: string;
  status: "pendiente" | "en_progreso" | "completado" | "cancelado";
  location?: string;
  visitor_id: string;
  host_employee_id?: string;
  supplier_id?: string;
  created_at: string;
  updated_at: string;
  visitor?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profile_image_url?: string;
    card?: {
      id: string;
      card_number: string;
    };
  };
  host_employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateAppointmentDto {
  title: string;
  description?: string;
  scheduled_time: string;
  location?: string;
  visitor_id: string;
  host_employee_id?: string;
  supplier_id?: string;
}

export interface UpdateAppointmentDto {
  title?: string;
  description?: string;
  scheduled_time?: string;
  location?: string;
  status?: "pendiente" | "en_progreso" | "completado" | "cancelado";
  host_employee_id?: string;
  check_in_time?: string;
  check_out_time?: string;
}

class AppointmentService {
  async getAll(supplierId?: string): Promise<Appointment[]> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<Appointment[]>("/appointments", { params });
    return response.data;
  }

  async getArchived(supplierId?: string): Promise<Appointment[]> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<Appointment[]>("/appointments/archived", { params });
    return response.data;
  }

  async getUpcoming(limit: number = 10, supplierId?: string): Promise<Appointment[]> {
    const params: { limit: number; supplierId?: string } = { limit };
    if (supplierId) params.supplierId = supplierId;
    const response = await api.get<Appointment[]>("/appointments/upcoming", { params });
    return response.data;
  }

  async getByDateRange(
    startDate: Date,
    endDate: Date,
    supplierId?: string
  ): Promise<Appointment[]> {
    const params: {
      startDate: string;
      endDate: string;
      supplierId?: string;
    } = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    if (supplierId) params.supplierId = supplierId;
    const response = await api.get<Appointment[]>("/appointments/date-range", { params });
    return response.data;
  }

  async getOne(id: string): Promise<Appointment> {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await api.post<Appointment>("/appointments", data);
    return response.data;
  }

  async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  }

  async checkIn(id: string): Promise<Appointment> {
    const response = await api.patch<Appointment>(`/appointments/${id}/check-in`, {});
    return response.data;
  }

  async checkOut(id: string): Promise<Appointment> {
    const response = await api.patch<Appointment>(`/appointments/${id}/check-out`, {});
    return response.data;
  }

  async cancel(id: string): Promise<Appointment> {
    const response = await api.patch<Appointment>(`/appointments/${id}/cancel`, {});
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  }

  async archiveOldAppointments(supplierId?: string): Promise<{ archived: number }> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.post<{ archived: number }>("/appointments/archive-old", null, { params });
    return response.data;
  }
}

export const appointmentService = new AppointmentService();
