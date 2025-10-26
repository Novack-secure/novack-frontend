import { api } from "../api";

export interface Card {
  id: string;
  card_uuid: string;
  battery_percentage?: number;
  status: "active" | "inactive" | "lost" | "damaged";
  last_seen?: string;
  assigned_to_employee_id?: string;
  assigned_to_visitor_id?: string;
  supplier_id: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  visitor?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateCardDto {
  card_uuid: string;
  supplier_id: string;
  battery_percentage?: number;
  status?: "active" | "inactive" | "lost" | "damaged";
}

export interface UpdateCardDto {
  card_uuid?: string;
  battery_percentage?: number;
  status?: "active" | "inactive" | "lost" | "damaged";
  assigned_to_employee_id?: string;
  assigned_to_visitor_id?: string;
}

export interface AssignCardDto {
  employeeId?: string;
  visitorId?: string;
}

class CardService {
  /**
   * Crear una nueva tarjeta
   */
  async create(data: CreateCardDto): Promise<Card> {
    const response = await api.post<Card>("/cards", data);
    return response.data;
  }

  /**
   * Obtener todas las tarjetas
   */
  async getAll(): Promise<Card[]> {
    const response = await api.get<Card[]>("/cards");
    return response.data;
  }

  /**
   * Obtener tarjetas por supplier
   */
  async getBySupplier(supplierId: string): Promise<Card[]> {
    const response = await api.get<Card[]>(`/cards/supplier/${supplierId}`);
    return response.data;
  }

  /**
   * Obtener tarjetas activas
   */
  async getActive(): Promise<Card[]> {
    const response = await api.get<Card[]>("/cards/active");
    return response.data;
  }

  /**
   * Obtener una tarjeta por ID
   */
  async getById(id: string): Promise<Card> {
    const response = await api.get<Card>(`/cards/${id}`);
    return response.data;
  }

  /**
   * Obtener una tarjeta por UUID
   */
  async getByUuid(uuid: string): Promise<Card> {
    const response = await api.get<Card>(`/cards/uuid/${uuid}`);
    return response.data;
  }

  /**
   * Actualizar una tarjeta
   */
  async update(id: string, data: UpdateCardDto): Promise<Card> {
    const response = await api.patch<Card>(`/cards/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar una tarjeta
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/cards/${id}`);
  }

  /**
   * Asignar tarjeta a un empleado o visitante
   */
  async assign(cardId: string, data: AssignCardDto): Promise<Card> {
    const response = await api.post<Card>(`/cards/${cardId}/assign`, data);
    return response.data;
  }

  /**
   * Desasignar tarjeta
   */
  async unassign(cardId: string): Promise<Card> {
    const response = await api.post<Card>(`/cards/${cardId}/unassign`);
    return response.data;
  }

  /**
   * Actualizar batería de una tarjeta
   */
  async updateBattery(cardId: string, percentage: number): Promise<Card> {
    const response = await api.patch<Card>(`/cards/${cardId}/battery`, {
      battery_percentage: percentage,
    });
    return response.data;
  }

  /**
   * Marcar tarjeta como perdida
   */
  async markAsLost(cardId: string): Promise<Card> {
    const response = await api.patch<Card>(`/cards/${cardId}/lost`);
    return response.data;
  }

  /**
   * Marcar tarjeta como dañada
   */
  async markAsDamaged(cardId: string): Promise<Card> {
    const response = await api.patch<Card>(`/cards/${cardId}/damaged`);
    return response.data;
  }

  /**
   * Reactivar tarjeta
   */
  async reactivate(cardId: string): Promise<Card> {
    const response = await api.patch<Card>(`/cards/${cardId}/reactivate`);
    return response.data;
  }

  /**
   * Obtener estadísticas de tarjetas
   */
  async getStats(supplierId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    lost: number;
    damaged: number;
    averageBattery: number;
  }> {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get("/cards/stats", { params });
    return response.data;
  }
}

export const cardService = new CardService();
