import Sport from "@/models/sport.model";
import { SportJson } from "./sport.interface";
import sport from "@/models/sport.model";

export interface ChampionshipJson {
  id?: string;
  name: string;
  sport: SportJson;
  sport_id: string;
}

export interface ChampionshipFormData {
  name: string;
  sport: Sport | null;
}

export interface ChampionshipFormErrors {
  name: string | null;
  sport: string | null;
}
