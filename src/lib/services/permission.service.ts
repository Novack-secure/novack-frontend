import { api } from "../api";
import type { Permission } from "../types/api.types";

export type { Permission };

export interface CreatePermissionDto {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionDto {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
}

/**
 * Servicio para gestionar permisos
 */
export const permissionService = {
  /**
   * Obtener todos los permisos
   */
  async getAll(resource?: string): Promise<Permission[]> {
    const params = resource ? { resource } : {};
    const { data } = await api.get<Permission[]>("/permissions", { params });
    return data;
  },

  /**
   * Obtener un permiso por ID
   */
  async getById(id: string): Promise<Permission> {
    const { data } = await api.get<Permission>(`/permissions/${id}`);
    return data;
  },

  /**
   * Crear un nuevo permiso
   */
  async create(permission: CreatePermissionDto): Promise<Permission> {
    const { data } = await api.post<Permission>("/permissions", permission);
    return data;
  },

  /**
   * Actualizar un permiso existente
   */
  async update(id: string, permission: UpdatePermissionDto): Promise<Permission> {
    const { data } = await api.patch<Permission>(`/permissions/${id}`, permission);
    return data;
  },

  /**
   * Eliminar un permiso
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/permissions/${id}`);
  },
};
