import { api } from "../api";
import type { AxiosRequestConfig } from "axios";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/api.types";

export type { Employee, CreateEmployeeDto, UpdateEmployeeDto };

/**
 * Servicio para gestionar empleados
 */
export const employeeService = {
  /**
   * Obtener todos los empleados
   */
  async getAll(): Promise<Employee[]> {
    const { data } = await api.get<Employee[]>("/employees");
    return data;
  },

  /**
   * Obtener un empleado por ID
   */
  async getById(id: string): Promise<Employee> {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  },

  /**
   * Obtener empleados por proveedor
   */
  async getBySupplier(supplierId: string): Promise<Employee[]> {
    const { data } = await api.get<Employee[]>(
      `/employees/supplier/${supplierId}`,
    );
    return data;
  },

  /**
   * Crear un nuevo empleado
   */
  async create(employee: CreateEmployeeDto): Promise<Employee> {
    const { data } = await api.post<Employee>("/employees", employee);
    return data;
  },

  /**
   * Actualizar un empleado existente
   */
  async update(id: string, employee: UpdateEmployeeDto): Promise<Employee> {
    const { data } = await api.patch<Employee>(`/employees/${id}`, employee);
    return data;
  },

  /**
   * Eliminar un empleado
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  },

  /**
   * Subir imagen de perfil del empleado
   */
  async uploadProfileImage(
    id: string,
    file: File,
  ): Promise<{ message: string; url: string }> {
    const formData = new FormData();
    formData.append("profileImage", file);

    const { data } = await api.patch<{ message: string; url: string }>(
      `/employees/${id}/profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },

  /**
   * Buscar empleado por UUID
   */
  async searchByUuid(uuid: string): Promise<Employee> {
    const { data } = await api.get<Employee>(
      `/employees/search/by-uuid?uuid=${uuid}`,
    );
    return data;
  },

  /**
   * Buscar contactos por nombre o email
   */
  async searchContacts(
    query: string,
    config?: AxiosRequestConfig,
  ): Promise<Employee[]> {
    const { data } = await api.get<Employee[]>(
      `/employees/search/contacts?q=${encodeURIComponent(query)}`,
      config,
    );
    return data;
  },
};
