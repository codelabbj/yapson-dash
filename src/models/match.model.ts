import { ClubJson } from "@/interfaces/club.interface";
import Club from "./club.model";
import { MatchJson } from "@/interfaces/match.interface";
import { Moment } from "moment";
import Championship from "@/models/championship.model";

class Match {
  id?: string;
  championship: Championship;
  clubHome: Club;
  clubForeign: Club;
  startDate: Date | Moment;
  clubHomeGoal: number | null;
  clubForeignGoal: number | null;

  constructor(
    championship: Championship,
    clubHome: Club,
    clubForeign: Club,
    startDate: Date | Moment,
    clubHomeGoal: number | null,
    clubForeignGoal: number | null,
    id?: string,
  ) {
    this.championship = championship;
    this.clubHome = clubHome;
    this.clubForeign = clubForeign;
    this.startDate = startDate;
    this.clubHomeGoal = clubHomeGoal;
    this.clubForeignGoal = clubForeignGoal;
    this.id = id;
  }

  static fromJson(json: MatchJson): Match {
    return new Match(
      Championship.fromJson(json.championnat),
      Club.fromJson(json.club_home),
      Club.fromJson(json.club_foreign),
      new Date(json.start_date),
      json.club_home_goal,
      json.club_foreign_goal,
      json.id,
    );
  }

  toJson(): MatchJson {
    return {
      id: this.id,
      championnat_id: this.championship.id!,
      championnat: this.championship.toJson(),
      club_home: this.clubHome.toJson(),
      club_foreign: this.clubForeign.toJson(),
      club_home_id: this.clubHome.id!,
      club_foreign_id: this.clubForeign.id!,
      start_date: this.startDate.toISOString(),
      club_home_goal: this.clubHomeGoal,
      club_foreign_goal: this.clubForeignGoal,
    };
  }
}

export default Match;
