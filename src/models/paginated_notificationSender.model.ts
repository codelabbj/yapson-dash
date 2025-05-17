import Notification, { NotificationJson } from "./notificationSender.model";

export interface PaginatedNotificationsJson {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationJson[];
}

class PaginatedNotification {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];

  constructor(
    count: number,
    next: string | null,
    previous: string | null,
    results: Notification[]
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedNotificationsJson): PaginatedNotification {
    const notifications = json.results.map(notificationJson => 
      Notification.fromJson(notificationJson)
    );

    return new PaginatedNotification(
      json.count,
      json.next,
      json.previous,
      notifications
    );
  }

  toJson(): PaginatedNotificationsJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map(notification => notification.toJson())
    };
  }
}

export default PaginatedNotification;