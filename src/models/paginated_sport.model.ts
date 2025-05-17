import { SportJson } from "@/interfaces/sport.interface";
import Sport from "@/models/sport.model";

export interface PaginatedSportJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: SportJson[];
}

class PaginatedSport {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sport[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Sport[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedSportJson): PaginatedSport {
    return new PaginatedSport(
      json.count,
      json.next,
      json.previous,
      json.results.map(Sport.fromJson),
    );
  }

  toJson(): PaginatedSportJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((sport) => sport.toJson()),
    };
  }
}

export default PaginatedSport;
