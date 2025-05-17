import api from "@/utils/api.util";
import Reward, { RewardJson } from "@/models/reward.model";
import PaginatedReward, {
  PaginatedRewardJson,
} from "@/models/paginated_reward.model";

class RewardApi {
  private static route: string = "/rewards";

  static async findMany(
    searchField: string = "",
    page: number = 1,
  ): Promise<PaginatedReward> {
    try {
      const response = await api.get<PaginatedRewardJson>(
        `${this.route}?search_field=${searchField}&page=${page}`,
      );
      return PaginatedReward.fromJson(response);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      throw error;
    }
  }

  static async findUnique(rewardId: string): Promise<Reward> {
    try {
      const response = await api.get<RewardJson>(`${this.route}/${rewardId}`);
      return Reward.fromJson(response);
    } catch (error) {
      console.error(`Error fetching reward with ID ${rewardId}:`, error);
      throw error;
    }
  }

  static async add(reward: Reward): Promise<Reward> {
    try {
      const rewardJson = reward.toJson();
      const response = await api.post<RewardJson>(this.route, rewardJson);
      return Reward.fromJson(response);
    } catch (error) {
      console.error("Error creating reward:", error);
      throw error;
    }
  }

  static async update(rewardId: string, reward: Reward): Promise<Reward> {
    try {
      const rewardJson = reward.toJson();
      const response = await api.put<RewardJson>(
        `${this.route}/${rewardId}`,
        rewardJson,
      );
      return Reward.fromJson(response);
    } catch (error) {
      console.error(`Error updating reward with ID ${rewardId}:`, error);
      throw error;
    }
  }

  static async remove(rewardId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${rewardId}`);
    } catch (error) {
      console.error(`Error deleting reward with ID ${rewardId}:`, error);
      throw error;
    }
  }
}

export default RewardApi;
