import { TicketJson } from "@/interfaces/ticket.interface";
import Ticket from "@/models/ticket.model";

export interface PaginatedTicketJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: TicketJson[];
}

class PaginatedTicket {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Ticket[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedTicketJson): PaginatedTicket {
    return new PaginatedTicket(
      json.count,
      json.next,
      json.previous,
      json.results.map(Ticket.fromJson),
    );
  }

  toJson(): PaginatedTicketJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((ticket) => ticket.toJson()),
    };
  }
}

export default PaginatedTicket;
