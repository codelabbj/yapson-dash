import { ClubJson } from "@/interfaces/club.interface";
import Club from "@/models/club.model";
import PaginatedClub, {
  PaginatedClubJson,
} from "@/models/paginated_club.model";
import api from "@/utils/api.util";
import { downloadFile } from "@/utils/functions.util";

class ClubApi {
  private static route: string = "/club";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedClub> {
    try {
      const response = await api.get<PaginatedClubJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );

      return PaginatedClub.fromJson(response);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      throw error;
    }
  }

  static async findUnique(clubId: string): Promise<Club> {
    try {
      const response = await api.get<ClubJson>(`${this.route}/${clubId}`);
      return Club.fromJson(response);
    } catch (error) {
      console.error(`Error fetching club with ID ${clubId}:`, error);
      throw error;
    }
  }

  static async add(club: Club): Promise<Club> {
    try {
      const response = await api.post<ClubJson>(this.route, club.toJson());

      return Club.fromJson(response);
    } catch (error) {
      console.error("Error creating club:", error);
      throw error;
    }
  }

  static async update(club: Club): Promise<Club> {
    try {
      const response = await api.put<ClubJson>(
        `${this.route}/${club.id}`,
        club.toJson(),
      );

      return Club.fromJson(response);
    } catch (error) {
      console.error(`Error updating club with ID ${club.id}:`, error);
      throw error;
    }
  }

  static async remove(clubId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${clubId}`);
    } catch (error) {
      console.error(`Error deleting club with ID ${clubId}:`, error);
      throw error;
    }
  }
}

export default ClubApi;
