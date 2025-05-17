import api from "@/utils/api.util";
import axios from "axios";
import Notification, { NotificationJson } from "@/models/notificationSender.model";
import PaginatedNotification, {
  PaginatedNotificationsJson,
} from "@/models/paginated_notificationSender.model";

class NotificationApi {
  private static route: string = "/public-notif";

  /**
   * Send a notification to users
   * @param notification The notification to send
   * @returns The created notification
   */
  static async send(notification: Notification): Promise<Notification> {
    try {
      const notificationJson = notification.toJson();
      const token = localStorage.getItem("access");
      
      const response = await axios.post<NotificationJson>(
        `https://api.betpayapp.com/betpay/public-notif?type=yapson_user`,
        notificationJson,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );
      
      return Notification.fromJson(response.data);
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }


  /**
   * Fetch bot users with optional search and pagination
   * @param searchField Optional search term
   * @param page Optional page number (default: 1)
   * @param pageSize Optional page size (default: 20)
   * @returns Paginated list of bot users
   */
  static async fetchBotUsers(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedNotification> {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get<PaginatedNotificationsJson>(
        `https://api.betpayapp.com/betpay${this.route}?search=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );

      return PaginatedNotification.fromJson(response.data);
    } catch (error) {
      console.error("Error fetching bot users:", error);
      throw error;
    }
  }

  /**
   * Get all notifications with optional pagination and search
   * @param searchField Optional search term
   * @param page Optional page number (default: 1)
   * @param pageSize Optional page size (default: 20)
   * @returns Paginated list of notifications
   */
  static async findMany(
    searchField?: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedNotification> {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get<PaginatedNotificationsJson>(
        `https://api.betpayapp.com/betpay/public-notif?search=${searchField ?? ""}&page=${page ?? 1}&page_size=${pageSize ?? 20}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );
      
      return PaginatedNotification.fromJson(response.data);
    } catch (error) {
      console.error("Error fetching paginated notifications:", error);
      throw error;
    }
  }

  /**
   * Get a specific notification by ID
   * @param notificationId The ID of the notification to retrieve
   * @returns The notification
   */
  static async findUnique(notificationId: string): Promise<Notification> {
    try {
      const response = await api.get<NotificationJson>(`${this.route}/${notificationId}`);
      return Notification.fromJson(response);
    } catch (error) {
      console.error(`Error fetching notification with ID ${notificationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a notification by ID
   * @param notificationId The ID of the notification to delete
   */
  static async remove(notificationId: string): Promise<void> {
    try {
      await api.delete(`${this.route}/${notificationId}`);
    } catch (error) {
      console.error(`Error deleting notification with ID ${notificationId}:`, error);
      throw error;
    }
  }

  /**
   * Get notifications for a specific user
   * @param userId The ID of the user
   * @param page Optional page number (default: 1)
   * @param pageSize Optional page size (default: 20)
   * @returns Paginated list of user's notifications
   */
  static async findUserNotifications(
    userId: string,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedNotification> {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get<PaginatedNotificationsJson>(
        `https://api.betpayapp.com/betpay/public-notif/user/${userId}?page=${page ?? 1}&page_size=${pageSize ?? 20}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );
      
      return PaginatedNotification.fromJson(response.data);
    } catch (error) {
      console.error(`Error fetching notifications for user with ID ${userId}:`, error);
      throw error;
    }
  }
}

export default NotificationApi;