import { ClubJson } from "@/interfaces/club.interface";

class Club {
  id?: string;
  name: string;
  logo: File | string;
  createdAt: Date;

  constructor(name: string, logo: File | string, createdAt: Date, id?: string) {
    this.name = name;
    this.logo = logo;
    this.createdAt = createdAt;
    this.id = id;
  }

  static fromJson(json: ClubJson): Club {
    return new Club(json.name, json.logo, new Date(json.created_at), json.id);
  }

  toJson(): ClubJson {
    return {
      id: this.id,
      name: this.name,
      logo: this.logo,
      created_at: this.createdAt.toISOString(),
    };
  }
}

export default Club;
