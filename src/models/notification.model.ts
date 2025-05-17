import { NotificationJson } from "@/interfaces/notification.interface";
import User from "./user.model";

class Notification {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isReaded: boolean;
  user_id: any;

  constructor(
    id: string,
    title: string,
    content: string,
    createdAt: Date,
    isReaded: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.isReaded = isReaded;
  }

  static fromJson(json: NotificationJson): Notification {
    return new Notification(
      json.id,
      json.title,
      json.content,
      new Date(json.created_at),
      json.is_read,
    );
  }

  toJson(): NotificationJson {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      created_at: this.createdAt.toDateString(),
      is_read: this.isReaded,
    };
  }
}

export default Notification;
