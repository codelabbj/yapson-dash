export interface ClubJson {
  id?: string;
  name: string;
  logo: File | string;
  created_at: string;
}

export interface ClubFormData {
  name: string;
  logo: File | string | null;
}

export interface ClubFormErrors {
  name: string | null;
  logo: string | null;
}
