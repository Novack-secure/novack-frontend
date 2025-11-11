import { api } from "../api";

export interface Visitor {
  id: string;
  name: string; // Backend uses 'name' not 'first_name' and 'last_name'
  email: string;
  phone: string;
  location?: string;
  state?: string;
  profile_image_url?: string;
  additional_info?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  supplier_id?: string;
  supplier?: {
    id: string;
    supplier_name: string;
  };
  appointment?: Appointment; // For backward compatibility
  appointments?: Appointment[]; // Backend returns this
}

export interface Appointment {
  id: string;
  purpose: string;
  host_employee_id?: string;
  check_in_time: string;
  check_out_time?: string;
  status: "scheduled" | "checked_in" | "checked_out" | "cancelled";
  location?: string;
  visitor_id: string;
  supplier_id: string;
  created_at: string;
  updated_at: string;
  host_employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  visitor?: Visitor;
}

interface CreateVisitorDto {
  first_name: string;
  last_name: string;
  id_type: string;
  id_number: string;
  email: string;
  phone: string;
  supplier_id: string;
  purpose: string;
  host_employee_id?: string;
  check_in_time: string;
  check_out_time?: string;
  location?: string;
  additional_info?: Record<string, unknown>;
}

export interface UpdateVisitorDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  purpose?: string;
  host_employee_id?: string;
  check_in_time?: string;
  check_out_time?: string;
  location?: string;
  status?: "scheduled" | "checked_in" | "checked_out" | "cancelled";
  additional_info?: Record<string, unknown>;
}

class VisitorService {
  /**
   * Crear un visitante con una cita
   */
  async create(data: CreateVisitorDto): Promise<Visitor> {
    const response = await api.post<Visitor>("/visitors", data);
    return response.data;
  }

  /**
   * Obtener todos los visitantes
   */
  async getAll(supplierId?: string): Promise<Visitor[]> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get<Visitor[]>("/visitors", { params });
    return response.data;
  }

  /**
   * Obtener visitantes por supplier
   */
  async getBySupplier(supplierId: string): Promise<Visitor[]> {
    const response = await api.get<Visitor[]>(
      `/visitors/by-supplier`,
      { params: { supplier_id: supplierId } }
    );
    return response.data;
  }

  /**
   * Obtener detalles de un visitante
   */
  async getDetails(id: string): Promise<Visitor> {
    const response = await api.get<Visitor>(`/visitors/${id}`);
    return response.data;
  }

  /**
   * Actualizar un visitante y su cita
   */
  async update(id: string, data: UpdateVisitorDto): Promise<Visitor> {
    const response = await api.patch<Visitor>(`/visitors/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar un visitante
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/visitors/${id}`);
  }

  /**
   * Check-out de un visitante
   */
  async checkOut(id: string): Promise<Visitor> {
    const response = await api.patch<Visitor>(`/visitors/${id}/checkout`);
    return response.data;
  }

  /**
   * Subir imagen de perfil de visitante
   */
  async uploadProfileImage(id: string, file: File): Promise<Visitor> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<Visitor>(
      `/visitors/${id}/profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  /**
   * Obtener todas las citas
   */
  async getAllAppointments(): Promise<Appointment[]> {
    const visitors = await this.getAll();
    return visitors
      .filter((v) => v.appointment)
      .map((v) => v.appointment!) as Appointment[];
  }

  /**
   * Obtener citas por estado
   */
  async getAppointmentsByStatus(
    status: "scheduled" | "checked_in" | "checked_out" | "cancelled",
  ): Promise<Appointment[]> {
    const appointments = await this.getAllAppointments();
    return appointments.filter((a) => a.status === status);
  }

  /**
   * Obtener citas de hoy
   */
  async getTodayAppointments(): Promise<Appointment[]> {
    const appointments = await this.getAllAppointments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.filter((a) => {
      const checkInDate = new Date(a.check_in_time);
      return checkInDate >= today && checkInDate < tomorrow;
    });
  }

  /**
   * Obtener próximas citas
   */
  async getUpcomingAppointments(): Promise<Appointment[]> {
    const appointments = await this.getAllAppointments();
    const now = new Date();

    return appointments
      .filter((a) => {
        const checkInDate = new Date(a.check_in_time);
        return (
          checkInDate > now &&
          (a.status === "scheduled" || a.status === "checked_in")
        );
      })
      .sort((a, b) => {
        return (
          new Date(a.check_in_time).getTime() -
          new Date(b.check_in_time).getTime()
        );
      });
  }
}

export const visitorService = new VisitorService();
