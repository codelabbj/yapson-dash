import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import SettingApi from "@/api/setting.api";
import Setting from "@/models/Setting.model";
import PaginatedSetting from "@/models/paginated_setting.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface SettingStore {
  settings: Setting[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchSettings: () => Promise<void>;
  researchSettings: () => Promise<Setting[] | undefined>;
  researchAddSetting: (setting: Setting) => Promise<Setting | undefined>;
  addSetting: (setting: Setting) => Promise<Setting | string | undefined>;
  updateSetting: (setting: Setting) => Promise<Setting | string | undefined>;
  deleteSetting: (settingId: string) => Promise<boolean | undefined>;
}

const useSettingStore = create<SettingStore>()(
  persist(
    (set, get) => ({
      settings: [],
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,

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

      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const settings = await SettingApi.findMany();

          set((state) => ({
            settings: settings,
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

      researchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const settings = await SettingApi.findMany();

          return settings;
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

      researchAddSetting: async (setting: Setting) => {
        set({ error: null });
        try {
          return await SettingApi.add(setting);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addSetting: async (setting: Setting) => {
        set({ error: null });
        try {
          const addedSetting = await SettingApi.add(setting);
          set((state) => {
            const settingsList = state.settings;

            settingsList.push(addedSetting);

            return {
              settings: settingsList,
            };
          });
          return addedSetting;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateSetting: async (setting: Setting) => {
        set({ error: null });
        try {
          const updatedsetting = await SettingApi.update(setting);

          set((state) => {
            const settingsList = state.settings;

            const unUpdatedsettingIndex = settingsList.findIndex(
              (ch) => ch.id === setting.id,
            );

            if (unUpdatedsettingIndex !== -1) {
              settingsList[unUpdatedsettingIndex] = updatedsetting;
            }

            return {
              settings: settingsList,
            };
          });

          return updatedsetting;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteSetting: async (settingId: string) => {
        set({ error: null });
        try {
          await SettingApi.remove(settingId);
          set((state) => ({
            settings: state.settings.filter(
              (setting) => setting.id !== settingId,
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
      name: "SettingStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingStore;
