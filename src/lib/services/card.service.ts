import { api } from "../api";

export interface CardLocation {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  created_at: string;
}

export interface Card {
  id: string;
  card_number: string;
  card_uuid: string;
  is_active: boolean;
  status?: "active" | "inactive" | "lost" | "damaged" | "assigned" | "available";
  battery_percentage?: number;
  issued_at?: string;
  expires_at?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  additional_info?: Record<string, unknown>;
  supplier_id: string;
  assigned_to_id?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
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
  locations?: CardLocation[];
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
    const response = await api.put<Card>(`/cards/${id}`, data);
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
    // Calcular stats desde las tarjetas para evitar conflictos con /cards/:id
    const cards = supplierId 
      ? await this.getBySupplier(supplierId)
      : await this.getAll();
    
    const total = cards.length;
    const active = cards.filter(c => c.status === "active").length;
    const inactive = cards.filter(c => c.status === "inactive").length;
    const lost = cards.filter(c => c.status === "lost").length;
    const damaged = cards.filter(c => c.status === "damaged").length;
    const batterySum = cards.reduce((sum, c) => sum + (c.battery_percentage || 0), 0);
    const averageBattery = total > 0 ? Math.round(batterySum / total) : 0;
    
    return {
      total,
      active,
      inactive,
      lost,
      damaged,
      averageBattery,
    };
  }

  /**
   * Obtener historial de ubicaciones de una tarjeta
   */
  async getLocationHistory(cardId: string): Promise<CardLocation[]> {
    const response = await api.get<CardLocation[]>(
      `/cards/${cardId}/locations`,
    );
    return response.data;
  }

  /**
   * Registrar ubicación de una tarjeta
   */
  async recordLocation(
    cardId: string,
    latitude: number,
    longitude: number,
    accuracy?: number,
  ): Promise<CardLocation> {
    const response = await api.post<CardLocation>(`/cards/${cardId}/location`, {
      latitude,
      longitude,
      accuracy,
    });
    return response.data;
  }

  /**
   * Obtener última ubicación de una tarjeta
   */
  async getLastLocation(cardId: string): Promise<CardLocation | null> {
    const response = await api.get<CardLocation | null>(
      `/cards/${cardId}/last-location`,
    );
    return response.data;
  }

  /**
   * Obtener tarjetas cercanas a una ubicación
   */
  async getNearbyCards(
    latitude: number,
    longitude: number,
    radius: number = 100,
  ): Promise<Card[]> {
    const response = await api.get<Card[]>("/cards/nearby", {
      params: { lat: latitude, lng: longitude, radius },
    });
    return response.data;
  }
}

export const cardService = new CardService();
