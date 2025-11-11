import { api } from "../api";
import type { Role } from "../types/api.types";

export type { Role };

export interface CreateRoleDto {
  name: string;
  description?: string;
  is_system_role?: boolean;
  priority?: number;
  supplier_id?: string;
  permission_ids?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  priority?: number;
  permission_ids?: string[];
}

export interface AssignPermissionsDto {
  permission_ids: string[];
}

/**
 * Servicio para gestionar roles
 */
export const roleService = {
  /**
   * Obtener todos los roles
   */
  async getAll(supplierId?: string): Promise<Role[]> {
    const params = supplierId ? { supplierId } : {};
    const { data } = await api.get<Role[]>("/roles", { params });
    return data;
  },

  /**
   * Obtener roles del sistema
   */
  async getSystemRoles(): Promise<Role[]> {
    const { data } = await api.get<Role[]>("/roles/system");
    return data;
  },

  /**
   * Obtener un rol por ID
   */
  async getById(id: string): Promise<Role> {
    const { data } = await api.get<Role>(`/roles/${id}`);
    return data;
  },

  /**
   * Crear un nuevo rol
   */
  async create(role: CreateRoleDto): Promise<Role> {
    const { data } = await api.post<Role>("/roles", role);
    return data;
  },

  /**
   * Actualizar un rol existente
   */
  async update(id: string, role: UpdateRoleDto): Promise<Role> {
    const { data } = await api.patch<Role>(`/roles/${id}`, role);
    return data;
  },

  /**
   * Eliminar un rol
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  },

  /**
   * Asignar permisos a un rol
   */
  async assignPermissions(
    id: string,
    dto: AssignPermissionsDto
  ): Promise<Role> {
    const { data } = await api.post<Role>(`/roles/${id}/permissions`, dto);
    return data;
  },

  /**
   * Remover permisos de un rol
   */
  async removePermissions(
    id: string,
    dto: AssignPermissionsDto
  ): Promise<Role> {
    const { data } = await api.delete<Role>(`/roles/${id}/permissions`, {
      data: dto,
    });
    return data;
  },
};
