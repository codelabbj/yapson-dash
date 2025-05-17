import { NotificationJson } from "@/interfaces/notification.interface";

import api from "@/utils/api.util";
import Notification from "@/models/notification.model";
import PaginatedNotification, {
  PaginatedNotificationJson,
} from "@/models/paginated_notification.model";

class NotificationApi {
  private static route: string = "/notification";

  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedNotification> {
    try {
      const response = await api.get<PaginatedNotificationJson>(
        `${this.route}?search_fields=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
      );
      return PaginatedNotification.fromJson(response);
    } catch (error) {
      console.error("Error fetching Notifications:", error);
      throw error;
    }
  }

  static async findUnique(notificationId: string): Promise<Notification> {
    try {
      const response = await api.get<NotificationJson>(
        `${this.route}/${notificationId}`,
      );
      return Notification.fromJson(response);
    } catch (error) {
      console.error(
        `Error fetching notification with ID ${notificationId}:`,
        error,
      );
      throw error;
    }
  }

  static async add(notification: Notification): Promise<Notification> {
    try {
      const notificationJson = notification.toJson();
      const response = await api.post<NotificationJson>(
        `${this.route}/`,
        notificationJson,
      );
      return Notification.fromJson(response);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  static async update(notification: Notification): Promise<Notification> {
    try {
      const notificationJson = notification.toJson();
      const response = await api.put<NotificationJson>(
        `${this.route}/${notification.id}`,
        notificationJson,
      );
      return Notification.fromJson(response);
    } catch (error) {
      console.error(
        `Error updating notification with ID ${notification.id}:`,
        error,
      );
      throw error;
    }
  }

  static async remove(notificationId: string): Promise<void> {
    try {
      await api.delete<void>(`${this.route}/${notificationId}`);
    } catch (error) {
      console.error(
        `Error deleting notification with ID ${notificationId}:`,
        error,
      );
      throw error;
    }
  }
}

export default NotificationApi;
