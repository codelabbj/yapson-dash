import { TransactionJson } from "@/interfaces/transaction.interface";
import Transaction from "./transaction.model";

abstract class JsonSerializable {
  abstract toJson(): any;
  static fromJson<T extends JsonSerializable>(this: new () => T, json: any) {}
}

export interface PaginatedTransactionJson<T = TransactionJson> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class DefaultSerializable extends JsonSerializable {
  [key: string]: any;

  toJson(): any {
    return {};
  }

  static fromJson(json: any): DefaultSerializable {
    return new DefaultSerializable();
  }
}

class PaginatedTransaction<T extends DefaultSerializable = Transaction> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: T[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson<T extends DefaultSerializable = Transaction>(
    json: PaginatedTransactionJson<T>,
    ctor: { new (...params: any[]): T; fromJson(json: any): T },
  ): PaginatedTransaction<T> {
    return new PaginatedTransaction(
      json.count,
      json.next,
      json.previous,
      (json.results ?? json).map((e) => ctor.fromJson(e)),
    );
  }

  toJson<
    T extends DefaultSerializable = Transaction,
  >(): PaginatedTransactionJson<T> {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((transaction) => transaction.toJson()),
    };
  }
}

export default PaginatedTransaction;
