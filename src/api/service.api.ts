import { ServiceJson } from "@/interfaces/service.interface";

import api from "@/utils/api.util";
import Service from "@/models/service.model";
import PaginatedService, {
  PaginatedServiceJson,
} from "@/models/paginated_service.model";

class ServiceApi {
  private static route: string = "/";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedService> {
    try {
      const response = await api.get<PaginatedServiceJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedService.fromJson(response);
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  static async findUnique(serviceId: string): Promise<Service> {
    try {
      const response = await api.get<ServiceJson>(`${this.route}/${serviceId}`);
      return Service.fromJson(response);
    } catch (error) {
      console.error(`Error fetching service with ID ${serviceId}:`, error);
      throw error;
    }
  }

  static async add(service: Service): Promise<Service> {
    try {
      const serviceJson = service.toJson();
      const response = await api.post<ServiceJson>(
        `${this.route}`,
        serviceJson,
      );
      return Service.fromJson(response);
    } catch (error) {
      console.error("Error creating service. :", error);
      throw error;
    }
  }

  static async update(service: Service): Promise<Service> {
    try {
      const serviceJson = service.toJson();
      const response = await api.patch<ServiceJson>(
        `${this.route}/${service.id}`,
        serviceJson,
      );
      return Service.fromJson(response);
    } catch (error) {
      console.error(`Error updating service with ID ${service.id}:`, error);
      throw error;
    }
  }

  static async remove(serviceId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${serviceId}`);
    } catch (error) {
      console.error(`Error deleting service with ID ${serviceId}:`, error);
      throw error;
    }
  }
}

export default ServiceApi;
