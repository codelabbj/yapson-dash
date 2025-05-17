import { ChampionshipJson } from "@/interfaces/championship.interface";
import Championship from "@/models/championship.model";

export interface PaginatedChampionshipJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChampionshipJson[];
}

class PaginatedChampionship {
  count: number;
  next: string | null;
  previous: string | null;
  results: Championship[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Championship[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedChampionshipJson): PaginatedChampionship {
    return new PaginatedChampionship(
      json.count,
      json.next,
      json.previous,
      json.results.map(Championship.fromJson),
    );
  }

  toJson(): PaginatedChampionshipJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((championship) => championship.toJson()),
    };
  }
}

export default PaginatedChampionship;
