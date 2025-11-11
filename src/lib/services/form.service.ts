import { api } from '@/lib/api';
import type {
  FormTemplate,
  FormSubmission,
  CreateFormTemplateDto,
  SubmitFormDto,
  UpdateSubmissionStatusDto,
  CreateAppointmentFromSubmissionDto,
  SubmissionStats,
  SubmissionFilters,
} from '@/types/form.types';

// Form Templates
export const formTemplateService = {
  /**
   * Crear nuevo formulario (requiere autenticación)
   */
  async create(data: CreateFormTemplateDto): Promise<FormTemplate> {
    const response = await api.post('/form-templates', data);
    return response.data;
  },

  /**
   * Obtener todos los formularios del supplier
   */
  async findAll(): Promise<FormTemplate[]> {
    const response = await api.get('/form-templates');
    return response.data;
  },

  /**
   * Obtener formulario por ID
   */
  async findOne(id: string): Promise<FormTemplate> {
    const response = await api.get(`/form-templates/${id}`);
    return response.data;
  },

  /**
   * Obtener formulario por slug (público)
   */
  async findBySlug(slug: string): Promise<FormTemplate> {
    const response = await api.get(`/form-templates/public/${slug}`);
    return response.data;
  },

  /**
   * Actualizar formulario
   */
  async update(id: string, data: Partial<CreateFormTemplateDto>): Promise<FormTemplate> {
    const response = await api.patch(`/form-templates/${id}`, data);
    return response.data;
  },

  /**
   * Desactivar formulario
   */
  async deactivate(id: string): Promise<void> {
    await api.patch(`/form-templates/${id}/deactivate`, null);
  },

  /**
   * Eliminar formulario
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/form-templates/${id}`);
  },
};

// Form Submissions
export const formSubmissionService = {
  /**
   * Enviar formulario (público)
   */
  async submit(slug: string, data: SubmitFormDto): Promise<FormSubmission> {
    const response = await api.post(`/form-submissions/public/${slug}`, data);
    return response.data;
  },

  /**
   * Obtener todas las submissions con filtros
   */
  async findAll(filters?: SubmissionFilters): Promise<FormSubmission[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.formTemplateId) params.append('formTemplateId', filters.formTemplateId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await api.get(`/form-submissions?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener estadísticas de submissions
   */
  async getStats(): Promise<SubmissionStats> {
    const response = await api.get('/form-submissions/stats');
    return response.data;
  },

  /**
   * Obtener una submission por ID
   */
  async findOne(id: string): Promise<FormSubmission> {
    const response = await api.get(`/form-submissions/${id}`);
    return response.data;
  },

  /**
   * Actualizar estado de una submission
   */
  async updateStatus(id: string, data: UpdateSubmissionStatusDto): Promise<FormSubmission> {
    const response = await api.patch(`/form-submissions/${id}/status`, data);
    return response.data;
  },

  /**
   * Crear appointment desde una submission
   */
  async createAppointment(
    id: string,
    data: CreateAppointmentFromSubmissionDto
  ): Promise<unknown> {
    const response = await api.post(`/form-submissions/${id}/create-appointment`, data);
    return response.data;
  },
};
