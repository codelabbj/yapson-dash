import { DepositJson } from "@/interfaces/deposit.interface";
import Service from "./service.model";
import App from "@/models/app.model";

class Deposit {
  id?: string;
  bet_app: App | null;
  amount: string;
  createdAt: Date;

  constructor(
    bet_app: App | null,
    amount: string,
    createdAt: Date,
    id?: string,
  ) {
    this.id = id;
    this.bet_app = bet_app;
    this.amount = amount;
    this.createdAt = createdAt;
  }

  static fromJson(json: DepositJson): Deposit {
    return new Deposit(
      json.bet_app != null ? App.fromJson(json.bet_app) : null,
      json.amount,
      new Date(json.created_at),
      json.id,
    );
  }

  toJson(): DepositJson {
    return {
      bet_app: this.bet_app?.toJson() ?? null,
      amount: this.amount,
      created_at: this.createdAt.toISOString(),
      id: this.id,
    };
  }
}

export default Deposit;
