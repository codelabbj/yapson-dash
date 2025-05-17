export interface SportJson {
  id?: string;
  name: string;
}

export interface SportFormData {
  name: string;
}

export interface SportFormErrors {
  name: string | null;
}
