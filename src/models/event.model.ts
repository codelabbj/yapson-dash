import { ClubJson } from "@/interfaces/club.interface";
import Club from "./club.model";
import { EventJson } from "@/interfaces/event.interface";
import { Moment } from "moment";
import Match from "@/models/match.model";

class Event {
  id?: string;
  match: Match;
  status: string;
  bet: string;
  coast: string;
  createdAt: Date;

  constructor(
    match: Match,
    status: string,
    bet: string,
    coast: string,

    createdAt: Date,

    id?: string,
  ) {
    this.match = match;
    this.status = status;
    this.bet = bet;
    this.coast = coast;

    this.createdAt = createdAt;
    this.id = id;
  }

  static fromJson(json: EventJson): Event {
    return new Event(
      Match.fromJson(json.match),
      json.status,
      json.bet,
      json.coast,

      new Date(json.created_at),
      json.id,
    );
  }

  toJson(): EventJson {
    return {
      id: this.id,
      match_id: this.match.id!,
      match: this.match.toJson(),
      status: this.status,
      bet: this.bet,
      coast: this.coast,

      created_at: this.createdAt.toISOString(),
    };
  }
}

export default Event;
