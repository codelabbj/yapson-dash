import { ChampionshipJson } from "@/interfaces/championship.interface";
import Sport from "./sport.model";

class Championship {
  id?: string;
  name: string;
  sport: Sport;

  constructor(name: string, sport: Sport, id?: string) {
    this.name = name;
    this.sport = sport;
    this.id = id;
  }

  static fromJson(json: ChampionshipJson): Championship {
    return new Championship(json.name, Sport.fromJson(json.sport), json.id);
  }

  toJson(): ChampionshipJson {
    return {
      id: this.id,
      name: this.name,
      sport: this.sport.toJson(),
      sport_id: this.sport.id!,
    };
  }
}

export default Championship;
