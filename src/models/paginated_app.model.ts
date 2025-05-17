import { AppJson } from "@/interfaces/app.interface";
import App from "@/models/app.model";

export interface PaginatedAppJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: AppJson[];
}

class PaginatedApp {
  count: number;
  next: string | null;
  previous: string | null;
  results: App[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: App[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedAppJson): PaginatedApp {
    return new PaginatedApp(
      json.count,
      json.next,
      json.previous,
      json.results.map(App.fromJson),
    );
  }

  toJson(): PaginatedAppJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((App) => App.toJson()),
    };
  }
}

export default PaginatedApp;
