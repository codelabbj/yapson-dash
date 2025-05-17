import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import NotificationApi from "@/api/notification.api";
import PaginatedNotification from "@/models/paginated_notification.model";
import Notification from "@/models/notification.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface NotificationStore {
  paginatedNotifications: PaginatedNotification;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchNotifications: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchNotifications: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedNotification | undefined>;
  researchAddNotification: (
    club: Notification,
  ) => Promise<Notification | undefined>;
  addNotification: (
    Notification: Notification,
  ) => Promise<Notification | undefined>;
  updateNotification: (
    Notification: Notification,
  ) => Promise<Notification | undefined>;
  deleteNotification: (NotificationId: string) => Promise<boolean | undefined>;
}

const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      paginatedNotifications: new PaginatedNotification(0, null, null, []),
      loading: false,
      error: null,
      page: 1,
      pageSize: 21,

      setPage: (newPage: number) => {
        set({ page: newPage });
      },

      increasePage: () => {
        set((state) => ({
          page: state.page + 1,
        }));
      },

      decreasePage: () => {
        set((state) => ({
          page: state.page - 1,
        }));
      },

      setPageSize: (newPageSize: number) => {
        set({ pageSize: newPageSize });
      },

      fetchNotifications: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedNotifications = await NotificationApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedNotifications: paginatedNotifications,
          }));
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        } finally {
          set({ loading: false });
        }
      },

      researchNotifications: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedNotifications = await NotificationApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedNotifications;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        } finally {
          set({ loading: false });
        }
      },
      researchAddNotification: async (Notification: Notification) => {
        set({ error: null });
        try {
          return await NotificationApi.add(Notification);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addNotification: async (Notification: Notification) => {
        set({ error: null });
        try {
          const addedNotification = await NotificationApi.add(Notification);
          set((state) => {
            const NotificationsList = state.paginatedNotifications.results;

            NotificationsList.push(addedNotification);

            return {
              paginatedNotifications: new PaginatedNotification(
                state.paginatedNotifications.count,
                state.paginatedNotifications.next,
                state.paginatedNotifications.previous,
                NotificationsList,
              ),
            };
          });
          return addedNotification;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateNotification: async (Notification: Notification) => {
        set({ error: null });
        try {
          const updatedNotification =
            await NotificationApi.update(Notification);

          set((state) => {
            const NotificationsList = state.paginatedNotifications.results;

            const unUpdatedNotificationIndex = NotificationsList.findIndex(
              (ch) => ch.id === Notification.id,
            );

            if (unUpdatedNotificationIndex !== -1) {
              NotificationsList[unUpdatedNotificationIndex] =
                updatedNotification;
            }

            return {
              paginatedNotifications: new PaginatedNotification(
                state.paginatedNotifications.count,
                state.paginatedNotifications.next,
                state.paginatedNotifications.previous,
                NotificationsList,
              ),
            };
          });

          return updatedNotification;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteNotification: async (NotificationId: string) => {
        set({ error: null });
        try {
          await NotificationApi.remove(NotificationId);
          set((state) => ({
            paginatedNotifications: new PaginatedNotification(
              state.paginatedNotifications.count,
              state.paginatedNotifications.next,
              state.paginatedNotifications.previous,
              state.paginatedNotifications.results.filter(
                (Notification) => Notification.id !== NotificationId,
              ),
            ),
          }));
          return true;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
          return false;
        }
      },
    }),
    {
      name: "NotificationStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useNotificationStore;
