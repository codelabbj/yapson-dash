import { DashboardJson } from "@/interfaces/dashboard.interface";

import api from "@/utils/api.util";
import Dashboard from "@/models/dashboard.model";

class DashboardApi {
  private static route: string = "/statistic";

  static async find(period: string): Promise<Dashboard> {
    try {
      const response = await api.get<DashboardJson>(
        `${this.route}?filter=${period}`,
      );
      return Dashboard.fromJson(response);
    } catch (error) {
      console.error(
        `Error fetching Dashboard statistic of period ${period}:`,
        error,
      );
      throw error;
    }
  }
}

export default DashboardApi;
