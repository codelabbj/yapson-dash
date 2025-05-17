import { DepositJson } from "@/interfaces/deposit.interface";
import Deposit from "@/models/deposit.model";

export interface PaginatedDepositJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepositJson[];
}

class PaginatedDeposit {
  count: number;
  next: string | null;
  previous: string | null;
  results: Deposit[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Deposit[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedDepositJson): PaginatedDeposit {
    return new PaginatedDeposit(
      json.count,
      json.next,
      json.previous,
      json.results.map(Deposit.fromJson),
    );
  }

  toJson(): PaginatedDepositJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((Deposit) => Deposit.toJson()),
    };
  }
}

export default PaginatedDeposit;
