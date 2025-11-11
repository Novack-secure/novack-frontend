export type EmployeeData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  is_creator: boolean;
  position?: string;
  department?: string;
  supplier_id?: string;
};

export type SupplierData = {
  supplier_name: string;
  supplier_creator: string;
  contact_email: string;
  phone_number: string; // backend espera 9 dígitos
  address: string;
  description: string;
  logo_url?: string;
  additional_info?: Record<string, unknown>;
  is_subscribed?: boolean;
  has_card_subscription?: boolean;
  has_sensor_subscription?: boolean;
  employee_count?: number;
  card_count?: number;
};

export type RegistrationData = {
  employee: EmployeeData;
  supplier?: SupplierData;
  verification_code?: string;
  employee_id?: string;
};

export type Step = {
  id: number;
  title: string;
  description: string;
  isCompleted?: boolean;
};

// Legacy interface duplicates removed to avoid multiple export conflicts
