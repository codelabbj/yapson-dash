import PaginatedChampionship, {
  PaginatedChampionshipJson,
} from "@/models/paginated_championship.model";
import { ChampionshipJson } from "@/interfaces/championship.interface";

import api from "@/utils/api.util";
import Championship from "@/models/championship.model";

class ChampionshipApi {
  private static route: string = "/championnat";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedChampionship> {
    try {
      const response = await api.get<PaginatedChampionshipJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedChampionship.fromJson(response);
    } catch (error) {
      console.error("Error fetching championships:", error);
      throw error;
    }
  }

  static async findUnique(championshipId: string): Promise<Championship> {
    try {
      const response = await api.get<ChampionshipJson>(
        `${this.route}/${championshipId}`,
      );
      return Championship.fromJson(response);
    } catch (error) {
      console.error(
        `Error fetching championship with ID ${championshipId}:`,
        error,
      );
      throw error;
    }
  }

  static async add(championship: Championship): Promise<Championship> {
    try {
      const championshipJson = championship.toJson();
      const response = await api.post<ChampionshipJson>(
        this.route,
        championshipJson,
      );
      return Championship.fromJson(response);
    } catch (error) {
      console.error("Error creating championship:", error);
      throw error;
    }
  }

  static async update(championship: Championship): Promise<Championship> {
    try {
      const championshipJson = championship.toJson();
      const response = await api.put<ChampionshipJson>(
        `${this.route}/${championship.id}`,
        championshipJson,
      );
      return Championship.fromJson(response);
    } catch (error) {
      console.error(
        `Error updating championship with ID ${championship.id}:`,
        error,
      );
      throw error;
    }
  }

  static async remove(championshipId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${championshipId}`);
    } catch (error) {
      console.error(
        `Error deleting championship with ID ${championshipId}:`,
        error,
      );
      throw error;
    }
  }
}

export default ChampionshipApi;
