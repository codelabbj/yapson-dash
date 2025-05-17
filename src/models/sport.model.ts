import { SportJson } from "@/interfaces/sport.interface";

class Sport {
  id?: string;
  name: string;

  constructor(name: string, id?: string) {
    this.name = name;

    this.id = id;
  }

  static fromJson(json: SportJson): Sport {
    return new Sport(json.name, json.id);
  }

  toJson(): SportJson {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export default Sport;
