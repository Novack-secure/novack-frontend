// Tipos comunes para las respuestas de la API

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Tipos de entidades del backend

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  profile_image_url?: string;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
  supplier_id: string;
  supplier?: Supplier;
}

export interface Supplier {
  id: string;
  supplier_name: string;
  supplier_creator: string;
  contact_email: string;
  phone_number: string;
  address: string;
  description: string;
  logo_url?: string;
  profile_image_url?: string;
  additional_info?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  card_number: string;
  status: 'available' | 'assigned' | 'lost' | 'inactive';
  battery_level?: number;
  last_seen?: string;
  assigned_to_id?: string;
  supplier_id: string;
  created_at: string;
  updated_at: string;
  assigned_to?: Employee | Visitor;
  supplier?: Supplier;
}

export interface Visitor {
  id: string;
  name: string;
  email?: string;
  phone: string;
  identification_number?: string;
  purpose: string;
  check_in_time?: string;
  check_out_time?: string;
  status: 'pending' | 'checked_in' | 'checked_out';
  profile_image_url?: string;
  supplier_id: string;
  supplier?: Supplier;
  appointments?: Appointment[];
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  visitor_id: string;
  employee_id?: string;
  supplier_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
  visitor?: Visitor;
  employee?: Employee;
  supplier?: Supplier;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'private' | 'group';
  created_at: string;
  updated_at: string;
  participants?: Employee[];
  lastMessage?: ChatMessage;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Employee;
}

export interface CardLocation {
  id: string;
  card_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  recorded_at: string;
  card?: Card;
}

// DTOs para crear/actualizar entidades

export interface CreateEmployeeDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  position?: string;
  department?: string;
  is_creator?: boolean;
  supplier_id: string;
}

export interface UpdateEmployeeDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
}

export interface CreateSupplierDto {
  supplier_name: string;
  supplier_creator?: string;
  contact_email: string;
  phone_number: string;
  address: string;
  description: string;
  logo_url?: string;
  additional_info?: Record<string, any>;
}

export interface UpdateSupplierDto {
  supplier_name?: string;
  contact_email?: string;
  phone_number?: string;
  address?: string;
  description?: string;
  logo_url?: string;
  additional_info?: Record<string, any>;
}

export interface CreateVisitorDto {
  name: string;
  email?: string;
  phone: string;
  identification_number?: string;
  purpose: string;
  supplier_id: string;
  appointment_date?: string;
  appointment_time?: string;
  notes?: string;
}

export interface UpdateVisitorDto {
  name?: string;
  email?: string;
  phone?: string;
  identification_number?: string;
  purpose?: string;
  appointment_date?: string;
  appointment_time?: string;
  notes?: string;
}

export interface CreateCardDto {
  card_number: string;
  supplier_id: string;
}

export interface UpdateCardDto {
  card_number?: string;
  status?: 'available' | 'assigned' | 'lost' | 'inactive';
  battery_level?: number;
}






