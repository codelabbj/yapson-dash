export interface ServiceFormData {
  name: string;
  email: string;
  phone: string;
  phoneIndication: string;
  secretKey: string;
  isActive: boolean;
}

export interface ServiceFormErrors {
  name: string | null;
  email: string | null;
  phone: string | null;
  phoneIndication: string | null;
  secretKey: string | null;
  isActive: string | null;
}

export interface ServiceJson {
  id: string;
  name: string;
  email: string;
  phone: string;
  phone_indication: string;
  secret_key: string;
  is_active: boolean;
}
