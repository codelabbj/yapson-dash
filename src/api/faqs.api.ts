import api from "@/utils/api.util";
import Reward, { RewardJson } from "@/models/reward.model";
import PaginatedReward, {
  PaginatedRewardJson,
} from "@/models/paginated_reward.model";
import Faq from "@/models/faq.model";
import { FaqJson } from "@/interfaces/faq.interface";

class FaqApi {
  private static route: string = "/faq";

  static async findMany(
    searchField: string = "",
    page: number = 1,
  ): Promise<Faq[]> {
    try {
      const response: FaqJson[] = (
        await api.get<any>(
          `${this.route}/?search_field=${searchField}&page=${page}`,
        )
      ).results;
      return response.map((e) => Faq.fromJson(e));
    } catch (error) {
      console.error("Error fetching rewards:", error);
      throw error;
    }
  }

  static async findUnique(faqId: string): Promise<Faq> {
    try {
      const response = await api.get<FaqJson>(`${this.route}/${faqId}`);
      return Faq.fromJson(response);
    } catch (error) {
      console.error(`Error fetching reward with ID ${faqId}:`, error);
      throw error;
    }
  }

  static async add(faq: Faq): Promise<Faq> {
    try {
      const faqJson = faq.toJson();
      const response = await api.post<FaqJson>(`${this.route}/`, faqJson);
      return Faq.fromJson(response);
    } catch (error) {
      console.error("Error creating reward:", error);
      throw error;
    }
  }

  static async update(faqId: string, faq: Faq): Promise<Faq> {
    try {
      const faqJson = faq.toJson();
      const response = await api.put<FaqJson>(
        `${this.route}/${faqId}/`,
        faqJson,
      );
      return Faq.fromJson(response);
    } catch (error) {
      console.error(`Error updating reward with ID ${faqId}:`, error);
      throw error;
    }
  }

  static async remove(faqId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${faqId}/`);
    } catch (error) {
      console.error(`Error deleting reward with ID ${faqId}:`, error);
      throw error;
    }
  }
}

export default FaqApi;
