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
  betapp: string;
  images: string[];
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
  image: string[] | File[];
  code: string;
  betapp: string;
}

export interface TicketFormErrorsV2 {
  image: string | null;
  code: string | null;
  betapp: string | null;
}

export interface TicketFormErrors {
  events: string | null;
  status: string | null;
  sample: string | null;
  subscription: string | null;
  betAmount: string | null;
}
