

export interface NetworkJson {
  id?: string;
  name: string;
  image: string | File;
  created_at: string;
  placeholder: string;
  public_name: string;
  country_code: string;
  indication: string;
  messageInit?: string;
  deposit_api?: string;
  withdrawal_api?: string;
  otp_required: boolean; // New field
}

export interface NetworkFormData {
  name: string;
  placeholder: string;
  public_name: string;
  country_code: string;
  indication: string;
  image: string | File;
  message_init?: string;
  deposit_api: string;
  withdrawal_api: string;
  otp_required: boolean; // New field
  [key: string]: string | File | boolean | undefined;
}

export interface NetworkFormErrors {
  name: string | null;
  placeholder: string | null;
  public_name: string | null;
  country_code: string | null;
  indication: string | null;
  image: string | null;
  deposit_api: string | null;
  withdrawal_api: string | null;
  otp_required: boolean; // New field
  [key: string]: string | null | boolean | undefined;
}