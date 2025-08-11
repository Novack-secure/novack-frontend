export interface EmployeeData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone: string
  is_creator: boolean
  position?: string
  department?: string
  supplier_id?: string
}

export interface SupplierData {
  supplier_name: string
  contact_email: string
  phone_number: string
  address: string
  description: string
  logo_url?: string
}

export interface RegistrationData {
  employee: EmployeeData
  supplier?: SupplierData
  verification_code?: string
}

export interface Step {
  id: number
  title: string
  description: string
  isCompleted: boolean
}
