import { ClubJson } from "@/interfaces/club.interface";
import Club from "./club.model";

export interface PaginatedClubJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClubJson[];
}

class PaginatedClub {
  count: number;
  next: string | null;
  previous: string | null;
  results: Club[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Club[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedClubJson): PaginatedClub {
    return new PaginatedClub(
      json.count,
      json.next,
      json.previous,
      json.results.map(Club.fromJson),
    );
  }

  toJson(): PaginatedClubJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((club) => club.toJson()),
    };
  }
}

export default PaginatedClub;
