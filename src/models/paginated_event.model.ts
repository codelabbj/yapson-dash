import { EventJson } from "@/interfaces/event.interface";
import Event from "./event.model";

export interface PaginatedEventJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: EventJson[];
}

class PaginatedEvent {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Event[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedEventJson): PaginatedEvent {
    return new PaginatedEvent(
      json.count,
      json.next,
      json.previous,
      json.results.map(Event.fromJson),
    );
  }

  toJson(): PaginatedEventJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((Event) => Event.toJson()),
    };
  }
}

export default PaginatedEvent;
