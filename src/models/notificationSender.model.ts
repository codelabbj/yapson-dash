export interface NotificationJson {
  id?: string;
  title: string;
  content: string;
  user_id: string | null;
  notification?: "push" | "email" | "whatsapp" | "telegram";
  created_at?: string;
  updated_at?: string;
}

class Notification {
  id?: string;
  title: string;
  content: string;
  user_id: string | null;
  notification: "push" | "email" | "whatsapp" | "telegram";
  created_at?: Date;
  updated_at?: Date;

  constructor(
    title: string,
    content: string,
    user_id: string | null = null,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
    notification: "push" | "email" | "whatsapp" | "telegram" = "push"
  ) {
    this.title = title;
    this.content = content;
    this.user_id = user_id;
    this.id = id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.notification = notification;
  }

  static fromJson(json: NotificationJson): Notification {
    return new Notification(
      json.title,
      json.content,
      json.user_id,
      json.id,
      json.created_at ? new Date(json.created_at) : undefined,
      json.updated_at ? new Date(json.updated_at) : undefined,
      json.notification ?? "push"
    );
  }

  toJson(): NotificationJson {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      user_id: this.user_id,
      notification: this.notification,
      created_at: this.created_at?.toISOString(),
      updated_at: this.updated_at?.toISOString(),
    };
  }
}

export default Notification;
