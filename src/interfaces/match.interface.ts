import Club from "@/models/club.model";
import { ClubJson } from "./club.interface";
import { Moment } from "moment";
import Championship from "@/models/championship.model";
import { ChampionshipJson } from "./championship.interface";

export interface MatchJson {
  id?: string;
  championnat_id: string;
  championnat: ChampionshipJson;
  club_home: ClubJson;
  club_foreign: ClubJson;
  club_home_id: string;
  club_foreign_id: string;
  start_date: string;
  club_home_goal: number | null;
  club_foreign_goal: number | null;
}

export interface MatchFormData {
  championship: Championship | null;
  clubHome: Club | null;
  clubForeign: Club | null;
  startDate: Date | Moment;
  clubHomeGoal: number | null;
  clubForeignGoal: number | null;
}

export interface MatchFormErrors {
  championship: string | null;
  clubHome: string | null;
  clubForeign: string | null;
  startDate: string | null;
  clubHomeGoal: string | null;
  clubForeignGoal: string | null;
}
