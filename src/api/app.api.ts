import { AppJson } from "@/interfaces/app.interface";
import PaginatedApp, { PaginatedAppJson } from "@/models/paginated_app.model";
import App from "@/models/app.model";

import api from "@/utils/api.util";

class AppApi {
  private static route: string = "/app_name";

  static async findMany(): Promise<App[]> {
    try {
      const response = await api.get<AppJson[]>(`${this.route}`);
      return response.map((data: AppJson) => App.fromJson(data));
    } catch (error) {
      console.error("Error fetching apps:", error);
      throw error;
    }
  }

  static async findUnique(appId: string): Promise<App> {
    try {
      const response = await api.get<AppJson>(`${this.route}/${appId}`);
      return App.fromJson(response);
    } catch (error) {
      console.error(`Error fetching app with ID ${appId}:`, error);
      throw error;
    }
  }
  static async add(app: App): Promise<App> {
    try {
      const appJson = app.toJson();
      if (appJson.id === undefined || appJson.id === null || appJson.id === "") {
        delete appJson.id;
      }
      const response = await api.post<AppJson>(`${this.route}`, {
        ...appJson,
        public_name: appJson.name,
      });
      return App.fromJson(response);
    } catch (error) {
      console.error("Error creating App:", error);
      throw error;
    }
  }

  static async update(app: App): Promise<App> {
    try {
      const appJson = app.toJson();
      // Do not send sensitive fields if user did not input them
      if (!appJson.cashdeskid) delete (appJson as any).cashdeskid;
      if (!appJson.hash) delete (appJson as any).hash;
      if (!appJson.cashierpass) delete (appJson as any).cashierpass;
      const response = await api.patch<AppJson>(
        `${this.route}/${app.id}`,
        appJson,
      );
      return App.fromJson(response);
    } catch (error) {
      console.error(`Error updating app with ID ${app.id}:`, error);
      throw error;
    }
  }

  static async remove(appId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${appId}`);
    } catch (error) {
      console.error(`Error deleting App with ID ${appId}:`, error);
      throw error;
    }
  }
}

export default AppApi;
