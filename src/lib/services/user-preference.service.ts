import { AxiosError } from "axios";
import { api } from "../api";

export enum PreferenceType {
  DASHBOARD_LAYOUT = "dashboard_layout",
  GRAPHS_LAYOUT = "graphs_layout",
  THEME = "theme",
  LANGUAGE = "language",
  NOTIFICATIONS = "notifications",
}

export interface UserPreference {
  id: string;
  preference_type: PreferenceType;
  preference_value: Record<string, unknown>;
  employee_id: string;
  created_at: string;
  updated_at: string;
}

export interface GraphLayout {
  slotOrder: string[];
  slotItems: Record<string, string>;
}

class UserPreferenceService {
  async create(preferenceType: PreferenceType, preferenceValue: Record<string, unknown>): Promise<UserPreference> {
    const response = await api.post<UserPreference>("/user-preferences", {
      preference_type: preferenceType,
      preference_value: preferenceValue,
    });
    return response.data;
  }

  async getAll(): Promise<UserPreference[]> {
    const response = await api.get<UserPreference[]>("/user-preferences");
    return response.data;
  }

  async getByType(type: PreferenceType): Promise<UserPreference | null> {
    try {
      const response = await api.get<UserPreference>(`/user-preferences/${type}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async update(type: PreferenceType, preferenceValue: Record<string, unknown>): Promise<UserPreference> {
    const response = await api.put<UserPreference>(`/user-preferences/${type}`, {
      preference_value: preferenceValue,
    });
    return response.data;
  }

  async delete(type: PreferenceType): Promise<void> {
    await api.delete(`/user-preferences/${type}`);
  }

  // Método específico para el layout de gráficas
  async saveGraphsLayout(layout: GraphLayout): Promise<UserPreference> {
    return this.create(PreferenceType.GRAPHS_LAYOUT, layout as unknown as Record<string, unknown>);
  }

  async getGraphsLayout(): Promise<GraphLayout | null> {
    const preference = await this.getByType(PreferenceType.GRAPHS_LAYOUT);
    return preference?.preference_value as GraphLayout | null;
  }
}

export const userPreferenceService = new UserPreferenceService();
