export interface AdvertisementFormData {
  image: string | File;
  content: string;
  enable: boolean;
}

export interface AdvertisementFormErrors {
  image: string | null;
  content: string | null;
  enable: string | null;
}

export interface AdvertisementJson {
  id?: string;
  image: string;
  content: string;
  created_at: string;
  enable: boolean;
}
