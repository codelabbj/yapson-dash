export interface AppJson {
  id?: string;
  name: string;
  image: string;
  hash: string;
  cashdeskid: string;
  cashierpass: string;
  deposit_tuto_content: string;
  deposit_link: string;
  withdrawal_tuto_content: string;
  withdrawal_link: string;
  order: string;
  city: string;
  street: string;
}

export interface AppFormData {
  name: string;
  image: File | string;
  hash: string;
  cashdeskid: string;
  cashierpass: string;
  deposit_tuto_content: string;
  deposit_link: string;
  withdrawal_tuto_content: string;
  withdrawal_link: string;
  order: string;
  city: string;
  street: string;
  id? : string;
}

export interface AppFormErrors {
  name: string | null;
  image: string | null;
  hash: string | null;
  cashdeskid: string | null;
  cashierpass: string | null;
  deposit_tuto_content: string | null;
  deposit_link: string | null;
  withdrawal_tuto_content: string | null;
  withdrawal_link: string | null;
  order: string | null;
  city: string | null;
  street: string | null;
}