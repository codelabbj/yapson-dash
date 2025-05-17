import Club from "@/models/club.model";
import { ClubJson } from "./club.interface";
import { Moment } from "moment";
import Match from "@/models/match.model";
import { MatchJson } from "./match.interface";

export interface EventJson {
  id?: string;
  match_id: string;
  match: MatchJson;
  created_at: string;
  bet: string;
  status: string;
  coast: string;
}

export interface EventFormData {
  match: Match | null;
  bet: string | null;
  status: string | null;
  coast: string | null;
}

export interface EventFormErrors {
  match: string | null;
  bet: string | null;
  status: string | null;
  coast: string | null;
}
