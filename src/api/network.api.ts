import { ClubJson } from "@/interfaces/club.interface";
import Club from "@/models/club.model";
import PaginatedClub, {
  PaginatedClubJson,
} from "@/models/paginated_club.model";
import api from "@/utils/api.util";
import { downloadFile } from "@/utils/functions.util";
import Network from "@/models/network.model";
import { NetworkJson } from "@/interfaces/network.interface";

class NetworkApi {
  private static route: string = "/network";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<Network[]> {
    try {
      const response = await api.get<NetworkJson[]>(`${this.route}/`);

      return response.map((e) => Network.fromJson(e));
    } catch (error) {
      console.error("Error fetching clubs:", error);
      throw error;
    }
  }

  static async findUnique(networkId: string): Promise<Network> {
    try {
      const response = await api.get<NetworkJson>(
        `${this.route}/${networkId}/`,
      );
      return Network.fromJson(response);
    } catch (error) {
      console.error(`Error fetching club with ID ${networkId}:`, error);
      throw error;
    }
  }

  static async add(network: Network): Promise<Network> {
    try {
      const response = await api.post<NetworkJson>(
        this.route + "/",
        network.toJson(),
      );

      return Network.fromJson(response);
    } catch (error) {
      console.error("Error creating club:", error);
      throw error;
    }
  }

  static async update(network: Network): Promise<Network> {
    try {
      const response = await api.put<NetworkJson>(
        `${this.route}/${network.id}/`,
        network.toJson(),
      );

      return Network.fromJson(response);
    } catch (error) {
      console.error(`Error updating club with ID ${network.id}:`, error);
      throw error;
    }
  }

  static async remove(networkId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${networkId}/`);
    } catch (error) {
      console.error(`Error deleting club with ID ${networkId}:`, error);
      throw error;
    }
  }
}

export default NetworkApi;
