import { ServiceJson } from "./service.interface";

export interface ServiceBalanceJson {
  id: string;
  bet_app : {
    name : string,
    public_name : string
  }

  solde: string;
  type: string;
  updated_at?: string;
}
