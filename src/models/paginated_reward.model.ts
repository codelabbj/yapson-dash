import Reward, { RewardJson } from "./reward.model";

export interface PaginatedRewardJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: RewardJson[];
}

class PaginatedReward {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reward[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Reward[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedRewardJson): PaginatedReward {
    return new PaginatedReward(
      json.count,
      json.next,
      json.previous,
      json.results.map(Reward.fromJson),
    );
  }

  toJson(): PaginatedRewardJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((reward) => reward.toJson()),
    };
  }
}

export default PaginatedReward;
