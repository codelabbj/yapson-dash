

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
  deposit_message?: string;
  withdrawal_message?: string;
  otp_required: boolean; // New field
  enable: boolean; // New field
  payment_by_link?: boolean; // New field for Connect Pro deposit API
  active_for_deposit?: boolean;
  active_for_with?: boolean;
  payment_by_ussd_code?: boolean;
  ussd_code?: string;
  reduce_fee?: boolean;
  fee_payin?: number;
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
  deposit_message?: string;
  withdrawal_message?: string;
  otp_required: boolean; // New field
  enable: boolean; // New field
  payment_by_link: boolean; // New field for Connect Pro deposit API
  active_for_deposit: boolean;
  active_for_with: boolean;
  payment_by_ussd_code: boolean;
  ussd_code: string;
  reduce_fee: boolean;
  fee_payin: number;
  [key: string]: string | File | boolean | number | undefined;
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
  deposit_message: string | null;
  withdrawal_message: string | null;
  otp_required: boolean; // New field
  enable: boolean; // New field
  payment_by_link: boolean; // New field for Connect Pro deposit API
  active_for_deposit: boolean;
  active_for_with: boolean;
  payment_by_ussd_code: boolean;
  reduce_fee: boolean;
  [key: string]: string | null | boolean | undefined;
}