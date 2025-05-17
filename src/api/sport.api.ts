import { SportJson } from "@/interfaces/sport.interface";

import api from "@/utils/api.util";
import Sport from "@/models/sport.model";
import PaginatedSport, {
  PaginatedSportJson,
} from "@/models/paginated_sport.model";

class SportApi {
  private static route: string = "/sport";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedSport> {
    try {
      const response = await api.get<PaginatedSportJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedSport.fromJson(response);
    } catch (error) {
      console.error("Error fetching sports:", error);
      throw error;
    }
  }

  static async findUnique(sportId: string): Promise<Sport> {
    try {
      const response = await api.get<SportJson>(`${this.route}/${sportId}`);
      return Sport.fromJson(response);
    } catch (error) {
      console.error(`Error fetching sport with ID ${sportId}:`, error);
      throw error;
    }
  }

  static async add(sport: Sport): Promise<Sport> {
    try {
      const sportJson = sport.toJson();
      const response = await api.post<SportJson>(`${this.route}/`, sportJson);
      return Sport.fromJson(response);
    } catch (error) {
      console.error("Error creating sport:", error);
      throw error;
    }
  }

  static async update(sport: Sport): Promise<Sport> {
    try {
      const sportJson = sport.toJson();
      const response = await api.patch<SportJson>(
        `${this.route}/${sport.id}/`,
        sportJson,
      );
      return Sport.fromJson(response);
    } catch (error) {
      console.error(`Error updating sport with ID ${sport.id}:`, error);
      throw error;
    }
  }

  static async remove(sportId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${sportId}/`);
    } catch (error) {
      console.error(`Error deleting sport with ID ${sportId}:`, error);
      throw error;
    }
  }
}

export default SportApi;
