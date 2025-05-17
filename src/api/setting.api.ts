import { SettingJson } from "@/interfaces/setting.interface";
import PaginatedSetting, {
  PaginatedSettingJson,
} from "@/models/paginated_setting.model";
import Setting from "@/models/Setting.model";

import api from "@/utils/api.util";

class SettingApi {
  private static route: string = "/setting";

  static async findMany(): Promise<Setting[]> {
    try {
      const response = await api.get<SettingJson[]>(`${this.route}/`);
      return response.map((data: SettingJson) => Setting.fromJson(data));
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  }

  static async findUnique(settingId: string): Promise<Setting> {
    try {
      const response = await api.get<SettingJson>(`${this.route}/${settingId}`);
      return Setting.fromJson(response);
    } catch (error) {
      console.error(`Error fetching setting with ID ${settingId}:`, error);
      throw error;
    }
  }

  static async add(setting: Setting): Promise<Setting> {
    try {
      const settingJson = setting.toJson();
      const response = await api.post<SettingJson>(
        `${this.route}/`,
        settingJson,
      );
      return Setting.fromJson(response);
    } catch (error) {
      console.error("Error creating setting:", error);
      throw error;
    }
  }

  static async update(setting: Setting): Promise<Setting> {
    try {
      const settingJson = setting.toJson();
      const response = await api.patch<SettingJson>(
        `${this.route}/${setting.id}/`,
        settingJson,
      );
      return Setting.fromJson(response);
    } catch (error) {
      console.error(`Error updating setting with ID ${setting.id}:`, error);
      throw error;
    }
  }

  static async remove(settingId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${settingId}`);
    } catch (error) {
      console.error(`Error deleting setting with ID ${settingId}:`, error);
      throw error;
    }
  }
}

export default SettingApi;
