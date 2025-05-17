import { UserJson } from "@/interfaces/user.interface";
import User from "./user.model";

export interface PaginatedUsersJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserJson[];
}

class PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: User[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedUsersJson): PaginatedUsers {
    return new PaginatedUsers(
      json.count,
      json.next,
      json.previous,
      json.results.map(User.fromJson),
    );
  }

  toJson(): PaginatedUsersJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((user) => user.toJson()),
    };
  }
}

export default PaginatedUsers;
