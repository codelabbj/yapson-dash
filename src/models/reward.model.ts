import { UserJson } from "@/interfaces/user.interface";
import User from "./user.model";
export interface RewardJson {
  id?: string;
  user: UserJson;
  amount: string;
}

class Reward {
  id?: string;
  user: User;
  amount: number;
  constructor(user: User, amount: number, id?: string) {
    this.user = user;
    this.amount = amount;
    this.id = id;
  }

  static fromJson(json: RewardJson): Reward {
    return new Reward(
      User.fromJson(json.user),
      Number.parseFloat(json.amount),
      json.id,
    );
  }

  toJson(): RewardJson {
    return {
      id: this.id,
      user: this.user.toJson(),
      amount: this.amount.toString(),
    };
  }
}

export default Reward;
