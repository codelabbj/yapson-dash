import { UserJson } from "./user.interface";

export interface NotificationJson {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
}
