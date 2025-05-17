import { ServiceBalanceJson } from "@/interfaces/service_balance.interface";
import ServiceBalance from "@/models/service_balance.model";

import api from "@/utils/api.util";

class ServiceBalanceApi {
  private static route: string = "/solde";

  static async findMany(): Promise<ServiceBalance[]> {
    try {
      const response = await api.get<ServiceBalanceJson[]>(`${this.route}`);
      return response.map((data: ServiceBalanceJson) =>
        ServiceBalance.fromJson(data),
      );
    } catch (error) {
      console.error("Error fetching service balances:", error);
      throw error;
    }
  }

  static async findMain(): Promise<ServiceBalance> {
    try {
      const response = await api.get<ServiceBalanceJson[]>(`${this.route}`);

      return ServiceBalance.fromJson(response[0]);
    } catch (error) {
      console.error(`Error fetching service balance`, error);
      throw error;
    }
  }

  static async add(serviceBalance: ServiceBalance): Promise<ServiceBalance> {
    try {
      const serviceBalanceJson = serviceBalance.toJson();
      const response = await api.post<ServiceBalanceJson>(
        `${this.route}/`,
        serviceBalanceJson,
      );
      return ServiceBalance.fromJson(response);
    } catch (error) {
      console.error("Error creating serviceBalance:", error);
      throw error;
    }
  }

  static async update(serviceBalance: ServiceBalance): Promise<ServiceBalance> {
    try {
      const serviceBalanceJson = serviceBalance.toJson();
      const response = await api.patch<ServiceBalanceJson>(
        `${this.route}/${serviceBalance.id}/`,
        serviceBalanceJson,
      );
      return ServiceBalance.fromJson(response);
    } catch (error) {
      console.error(
        `Error updating serviceBalance with ID ${serviceBalance.id}:`,
        error,
      );
      throw error;
    }
  }

  static async remove(serviceBalanceId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${serviceBalanceId}`);
    } catch (error) {
      console.error(
        `Error deleting serviceBalance with ID ${serviceBalanceId}:`,
        error,
      );
      throw error;
    }
  }
}

export default ServiceBalanceApi;
