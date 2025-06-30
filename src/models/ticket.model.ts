import { TicketJson } from "@/interfaces/ticket.interface";
import Event from "./event.model";
import { EventJson } from "@/interfaces/event.interface";

class Ticket {
  id?: string;
  code?: string;
  betapp: string;
  bet_app?: any;

  constructor(betapp: string, code?: string, id?: string) {
    this.code = code;
    this.betapp = betapp;
    this.id = id;
  }

  static fromJson(json: TicketJson): Ticket {
    const ticket = new Ticket(json.bet_app_id ?? "", json.code, json.id);
    if (typeof json.bet_app === 'object') {
      ticket.bet_app = json.bet_app;
    }
    return ticket;
  }

  toJson(): TicketJson {
    return {
      id: this.id,
      code: this.code,
      bet_app_id: this.betapp,
    
    } as any
  }
}

export default Ticket;
