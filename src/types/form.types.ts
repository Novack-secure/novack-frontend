export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  FILE = 'file',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface FormField {
  id: string;
  form_template_id: string;
  field_type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  order: number;
  validation_rules?: Record<string, unknown>;
  options?: string[];
  created_at: string;
  updated_at: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  slug: string;
  banner?: string;
  is_public: boolean;
  is_active: boolean;
  requires_approval: boolean;
  notification_emails?: string[];
  settings?: Record<string, unknown>;
  supplier_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  fields: FormField[];
  supplier?: {
    id: string;
    supplier_name: string;
  };
  created_by_employee?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FormAnswer {
  id: string;
  form_submission_id: string;
  form_field_id: string;
  value?: string;
  value_json?: unknown;
  created_at: string;
  form_field?: FormField;
}

export interface FormSubmission {
  id: string;
  form_template_id: string;
  supplier_id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  visitor_company?: string;
  status: SubmissionStatus;
  admin_notes?: string;
  metadata?: Record<string, unknown>;
  approved_by?: string;
  approved_at?: string;
  submitted_at: string;
  updated_at: string;
  form_template?: FormTemplate;
  answers: FormAnswer[];
  appointment?: {
    id: string;
    title: string;
    scheduled_time: string;
    status: string;
  };
  approved_by_employee?: {
    id: string;
    name: string;
    email: string;
  };
  supplier?: {
    id: string;
    supplier_name: string;
  };
}

// DTOs for API requests
export interface CreateFormFieldDto {
  field_type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  order: number;
  validation_rules?: Record<string, unknown>;
  options?: string[];
}

export interface CreateFormTemplateDto {
  name: string;
  description?: string;
  slug?: string;
  banner?: string;
  is_public?: boolean;
  requires_approval?: boolean;
  notification_emails?: string[];
  settings?: Record<string, unknown>;
  fields: CreateFormFieldDto[];
}

export interface FormAnswerDto {
  field_id: string;
  value: string | number | boolean | null | undefined;
}

export interface SubmitFormDto {
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  visitor_company?: string;
  answers: FormAnswerDto[];
  metadata?: Record<string, unknown>;
}

export interface UpdateSubmissionStatusDto {
  status: SubmissionStatus;
  admin_notes?: string;
}

export interface CreateAppointmentFromSubmissionDto {
  scheduled_time: string;
  location?: string;
  host_employee_id?: string;
  title?: string;
  description?: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  formTemplateId?: string;
  dateFrom?: string;
  dateTo?: string;
}
