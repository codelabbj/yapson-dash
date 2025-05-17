import { MatchJson } from "@/interfaces/match.interface";
import Match from "./match.model";

export interface PaginatedMatchJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: MatchJson[];
}

class PaginatedMatch {
  count: number;
  next: string | null;
  previous: string | null;
  results: Match[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Match[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedMatchJson): PaginatedMatch {
    return new PaginatedMatch(
      json.count,
      json.next,
      json.previous,
      json.results.map(Match.fromJson),
    );
  }

  toJson(): PaginatedMatchJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((match) => match.toJson()),
    };
  }
}

export default PaginatedMatch;
