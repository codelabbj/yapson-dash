import { SettingJson } from "@/interfaces/setting.interface";
import Setting from "@/models/Setting.model";

export interface PaginatedSettingJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: SettingJson[];
}

class PaginatedSetting {
  count: number;
  next: string | null;
  previous: string | null;
  results: Setting[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Setting[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedSettingJson): PaginatedSetting {
    return new PaginatedSetting(
      json.count,
      json.next,
      json.previous,
      json.results.map(Setting.fromJson),
    );
  }

  toJson(): PaginatedSettingJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((setting) => setting.toJson()),
    };
  }
}

export default PaginatedSetting;
