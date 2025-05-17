import { BetAppJson } from "@/interfaces/betapp.interface";


class BetApp {
  id?: string;
  name: string;

  constructor(name: string, id?: string) {
    this.name = name;
    this.id = id;
  }

  static fromJson(json: BetAppJson): BetApp {
    return new BetApp(json.name, json.id);
  }

  toJson(): BetAppJson {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export default BetApp;
