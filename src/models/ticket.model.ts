import { TicketJson } from "@/interfaces/ticket.interface";
import Event from "./event.model";
import { EventJson } from "@/interfaces/event.interface";

class Ticket {
  id?: string;
  code?: string;
  betapp: string;
  images: string[];

  constructor(betapp: string, images: string[], id?: string, code?: string) {
    this.code = code;
    this.betapp = betapp;
    this.images = images;
    this.id = id;
  }

  static fromJson(json: TicketJson): Ticket {
    return new Ticket(json.betapp, json.images, json.id, json.code);
  }

  toJson(): TicketJson {
    return {
      id: this.id,
      code: this.code,
      betapp: this.betapp,
      images: this.images,
    };
  }
}

export default Ticket;
