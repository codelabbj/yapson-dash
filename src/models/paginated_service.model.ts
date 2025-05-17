import { ServiceJson } from "@/interfaces/service.interface";
import Service from "@/models/service.model";

export interface PaginatedServiceJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceJson[];
}

class PaginatedService {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Service[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedServiceJson): PaginatedService {
    return new PaginatedService(
      json.count,
      json.next,
      json.previous,
      json.results.map(Service.fromJson),
    );
  }

  toJson(): PaginatedServiceJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((service) => service.toJson()),
    };
  }
}

export default PaginatedService;
