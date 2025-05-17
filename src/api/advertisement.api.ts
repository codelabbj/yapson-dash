import { AdvertisementJson } from "@/interfaces/advertisement.interface";
import PaginatedAdvertisement, {
  PaginatedAdvertisementJson,
} from "@/models/paginated_advertisement.model";
import Advertisement from "@/models/advertisement.model";

import api from "@/utils/api.util";

class AdvertisementApi {
  private static route: string = "/ann";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedAdvertisement> {
    try {
      const response = await api.get<PaginatedAdvertisementJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedAdvertisement.fromJson(response);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      throw error;
    }
  }

  static async findUnique(advertisementId: string): Promise<Advertisement> {
    try {
      const response = await api.get<AdvertisementJson>(
        `${this.route}/${advertisementId}`,
      );
      return Advertisement.fromJson(response);
    } catch (error) {
      console.error(
        `Error fetching advertisement with ID ${advertisementId}:`,
        error,
      );
      throw error;
    }
  }

  static async add(advertisement: Advertisement): Promise<Advertisement> {
    try {
      const advertisementJson = advertisement.toJson();
      const response = await api.post<AdvertisementJson>(
        `${this.route}`,
        advertisementJson,
      );
      return Advertisement.fromJson(response);
    } catch (error) {
      console.error("Error creating Advertisement:", error);
      throw error;
    }
  }

  static async update(advertisement: Advertisement): Promise<Advertisement> {
    try {
      const advertisementJson = advertisement.toJson();
      const response = await api.patch<AdvertisementJson>(
        `${this.route}/${advertisement.id}`,
        advertisementJson,
      );
      return Advertisement.fromJson(response);
    } catch (error) {
      console.error(
        `Error updating advertisement with ID ${advertisement.id}:`,
        error,
      );
      throw error;
    }
  }

  static async remove(advertisementId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${advertisementId}`);
    } catch (error) {
      console.error(
        `Error deleting Advertisement with ID ${advertisementId}:`,
        error,
      );
      throw error;
    }
  }
}

export default AdvertisementApi;
