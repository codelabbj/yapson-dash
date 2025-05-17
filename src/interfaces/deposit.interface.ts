import { AppJson } from "@/interfaces/app.interface";

export interface DepositJson {
  id?: string;
  bet_app: AppJson | null;
  amount: string;
  created_at: string;
}

export interface DepositFormData {
  amount: string;
  bet_app_id: string;
}

export interface DepositFormErrors {
  amount: string | null;
  bet_app_id: string | null;
}
