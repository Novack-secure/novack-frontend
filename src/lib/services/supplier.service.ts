import { api } from '../api';
import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../types/api.types';

/**
 * Servicio para gestionar proveedores
 */
export const supplierService = {
  /**
   * Obtener todos los proveedores
   */
  async getAll(): Promise<Supplier[]> {
    const { data } = await api.get<Supplier[]>('/suppliers');
    return data;
  },

  /**
   * Obtener un proveedor por ID
   */
  async getById(id: string): Promise<Supplier> {
    const { data } = await api.get<Supplier>(`/suppliers/${id}`);
    return data;
  },

  /**
   * Crear un nuevo proveedor
   */
  async create(supplier: CreateSupplierDto): Promise<Supplier> {
    const { data } = await api.post<Supplier>('/suppliers', supplier);
    return data;
  },

  /**
   * Actualizar un proveedor existente
   */
  async update(id: string, supplier: UpdateSupplierDto): Promise<Supplier> {
    const { data } = await api.patch<Supplier>(`/suppliers/${id}`, supplier);
    return data;
  },

  /**
   * Eliminar un proveedor
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  },

  /**
   * Subir imagen de perfil del proveedor
   */
  async uploadProfileImage(id: string, file: File): Promise<{ message: string; url: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);

    const { data } = await api.patch<{ message: string; url: string }>(
      `/suppliers/${id}/profile-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },
};






