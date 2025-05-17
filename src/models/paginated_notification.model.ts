import { NotificationJson } from "@/interfaces/notification.interface";
import Notification from "@/models/notification.model";

export interface PaginatedNotificationJson {
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
    results: Notification[],
  ) {
    this.count = count;
    this.next = next;
    this.previous = previous;
    this.results = results;
  }

  static fromJson(json: PaginatedNotificationJson): PaginatedNotification {
    return new PaginatedNotification(
      json.count,
      json.next,
      json.previous,
      json.results.map(Notification.fromJson),
    );
  }

  toJson(): PaginatedNotificationJson {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((notification) => notification.toJson()),
    };
  }
}

export default PaginatedNotification;
