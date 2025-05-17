import { AdvertisementJson } from "@/interfaces/advertisement.interface";
import Advertisement from "@/models/advertisement.model";

export interface PaginatedAdvertisementJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdvertisementJson[];
}

class PaginatedAdvertisement {
  count: number;
  next: string | null;
  previous: string | null;
  results: Advertisement[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Advertisement[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedAdvertisementJson): PaginatedAdvertisement {
    return new PaginatedAdvertisement(
      json.count,
      json.next,
      json.previous,
      json.results.map(Advertisement.fromJson),
    );
  }

  toJson(): PaginatedAdvertisementJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((Advertisement) => Advertisement.toJson()),
    };
  }
}

export default PaginatedAdvertisement;
