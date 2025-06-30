import Club from "@/models/club.model";
import { ClubJson } from "./club.interface";
import { Moment } from "moment";
import Match from "@/models/match.model";
import { MatchJson } from "./match.interface";
import Event from "@/models/event.model";
import { EventJson } from "./event.interface";

export interface TicketJson {
  id?: string;
  code?: string;
  bet_app_id?: string;
  bet_app?: any;
}

export interface BetApptJson {
  id?: string;
  name: string;
}

export interface TicketFormData {
  events: Event[];
  status: string | null;
  sample: string | null;
  subscription: string | null;
  betAmount: string | null;
}

export interface TicketFormDataV2 {
  code: string;
  bet_app_id: string;
}

export interface TicketFormErrorsV2 {
  code: string | null;
  bet_app_id: string | null;
}

export interface TicketFormErrors {
  events: string | null;
  status: string | null;
  sample: string | null;
  subscription: string | null;
  betAmount: string | null;
}
