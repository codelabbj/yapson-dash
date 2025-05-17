import { ServiceJson } from "@/interfaces/service.interface";
import Service from "./service.model";
import { ServiceBalanceJson } from "@/interfaces/service_balance.interface";

class ServiceBalance {
  id: string;
  name: string;
  publicName: string;
  balance: number;
  type: string;
  updatedAt: Date | null;

  constructor(
    id: string,
    name: string,
    publicName: string,
    balance: number,
    type: string,
    updatedAt: Date | null = null,
  ) {
    this.name = name;
    this.balance = balance;
    this.type = type;
    this.id = id;
    this.updatedAt = updatedAt;
    this.publicName = publicName;
  }

  static fromJson(json: ServiceBalanceJson): ServiceBalance {
    return new ServiceBalance(
      json.id,
      json.bet_app.name,
      json.bet_app.public_name,
      Number.parseFloat(json.solde),
      json.type,
      json.updated_at ? new Date(json.updated_at) : null,
    );
  }

  toJson(): ServiceBalanceJson {
    return {
      id: this.id,
      bet_app : {
        name : this.name,
        public_name : this.publicName
      },

      solde: this.balance.toString(),
      type: this.type,
      updated_at: this.updatedAt?.toISOString(),
    };
  }
}

export default ServiceBalance;
