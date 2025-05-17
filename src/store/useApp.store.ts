import Network from "@/models/network.model";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ClubApi from "@/api/club.api";
import Club from "@/models/club.model";
import PaginatedClub from "@/models/paginated_club.model";
import { extractAxiosError } from "@/utils/functions.util";
import { AxiosError } from "axios";
import NetworkApi from "@/api/network.api";
import App from "@/models/app.model";
import AppApi from "@/api/app.api";

interface AppStore {
  apps: App[];
  loading: boolean;
  error: string | null;
  fetchApp: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchApp: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<App[] | undefined>;
  researchAddApp: (app: App) => Promise<App | undefined>;
  addApp: (app: App) => Promise<App | string | undefined>;
  updateApp: (app: App) => Promise<App | string | undefined>;
  deleteApp: (appId: string) => Promise<boolean | undefined>;
}

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      apps: [] as App[],
      loading: false,
      error: null,
      fetchApp: async (searchField = "") => {
        set({ loading: true, error: null });
        try {
          const apps = await AppApi.findMany();

          set((state) => ({
            apps: apps,
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

      researchApp: async (searchField = "") => {
        set({ loading: true, error: null });
        try {
          return await AppApi.findMany();
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
      researchAddApp: async (app: App) => {
        set({ error: null });
        try {
          return await AppApi.add(app);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addApp: async (app: App) => {
        set({ error: null });
        try {
          const addedApp = await AppApi.add(app);
          set((state) => {
            const appsList = state.apps;

            appsList.push(addedApp);

            return {
              apps: appsList,
            };
          });
          return addedApp;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateApp: async (app: App) => {
        set({ error: null });
        try {
          const updatedApp = await AppApi.update(app);

          set((state) => {
            const appsList = state.apps;

            const unUpdatedAppId = state.apps.findIndex(
              (clb) => clb.id === app.id,
            );

            if (unUpdatedAppId != -1) {
                appsList[unUpdatedAppId] = updatedApp;
            }

            return {
              apps: appsList,
            };
          });

          return updatedApp;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteApp: async (appId: string) => {
        set({ error: null });
        try {
          await AppApi.remove(appId);
          set((state) => ({
            // paginatedClubs: new PaginatedClub(
            //   state.paginatedClubs.count,
            //   state.paginatedClubs.next,
            //   state.paginatedClubs.previous,
            //   state.paginatedClubs.results.filter((club) => club.id != clubId),
            // ),
            apps: state.apps.filter((club) => club.id != appId),
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
      name: "appStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAppStore;
