import { create } from 'zustand';
import NotificationApi from '@/api/notificationsender.api';
import Notification from '@/models/notificationSender.model';
import PaginatedNotification from '@/models/paginated_notificationSender.model';

interface NotificationSenderState {
  loading: boolean;
  sending: boolean;
  success: boolean;
  error: string | null;
  notification: Notification;
  paginatedNotifications: PaginatedNotification;
  page: number;
  isBroadcast: boolean;
  
  // Methods
  setNotification: (field: keyof Notification, value: any) => void;
  resetNotification: () => void;
  sendNotification: () => Promise<void>;
  fetchNotifications: (searchValue?: string, page?: number) => Promise<void>;
  setIsBroadcast: (isBroadcast: boolean) => void;
  increasePage: () => void;
  decreasePage: () => void;
  resetState: () => void;
}

const useNotificationSenderStore = create<NotificationSenderState>()((set, get) => ({
  loading: false,
  sending: false,
  success: false,
  error: null,
  notification: new Notification('', ''),
  paginatedNotifications: new PaginatedNotification(0, null, null, []),
  page: 1,
  isBroadcast: true,

  setNotification: (field, value) => {
    set((state) => {
      const currentNotification = state.notification;
      const updatedNotification = new Notification(
        field === 'title' ? value : currentNotification.title,
        field === 'content' ? value : currentNotification.content,
        field === 'user_id' ? value : currentNotification.user_id,
        currentNotification.id,
        currentNotification.created_at,
        currentNotification.updated_at
      );
      return { notification: updatedNotification };
    });
  },

  resetNotification: () => {
    set({ notification: new Notification('', '') });
  },

  sendNotification: async () => {
    set({ sending: true, error: null });
    try {
      await NotificationApi.send(get().notification);
      set({ success: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue' });
    } finally {
      set({ sending: false });
    }
  },

  fetchNotifications: async (searchValue = "", page = 1) => {
    set({ loading: true, error: null });
    try {
      const notifications = await NotificationApi.findMany(searchValue, page);
      set({ paginatedNotifications: notifications });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue' });
    } finally {
      set({ loading: false });
    }
  },

  setIsBroadcast: (isBroadcast) => {
    set({ isBroadcast });
  },

  increasePage: () => {
    set((state) => ({ page: state.page + 1 }));
  },

  decreasePage: () => {
    set((state) => ({ page: Math.max(1, state.page - 1) }));
  },

  resetState: () => {
    set({
      notification: new Notification('', ''),
      success: false,
      error: null,
    });
  },
}));

export default useNotificationSenderStore;
