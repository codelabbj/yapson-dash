import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import DashboardApi from "@/api/dashboard.api";
import Dashboard from "@/models/dashboard.model";
import { SelectItemProps } from "@/components/widget/Form/Select";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface DashboardStore {
  loading: boolean;
  error: string | null;
  dashboardData: Dashboard;

  period: string;
  periods: SelectItemProps[];
  setPeriod: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fetchDashboardData: (period?: string) => Promise<void>;
}

const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      loading: false,
      error: null,
      period: "all",
      periods: [
        {
          name: "Tout",
          value: "all",
        },
        {
          name: "Hier",
          value: "last_day",
        },
        {
          name: "Trois derniers jours",
          value: "last_three_day",
        },
        {
          name: "7 derniers jours",
          value: "last_week",
        },
        {
          name: "30 derniers jours",
          value: "last_month",
        },
      ],
      dashboardData: new Dashboard(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ),

      setPeriod: (e: React.ChangeEvent<HTMLSelectElement>) => {
        set({
          period:
            get().periods.find((prd) => prd.name === e.target.value)?.value ??
            "all",
        });
      },

      fetchDashboardData: async (period?: string) => {
        set({ loading: true, error: null });
        try {
          const stats = await DashboardApi.find(period ?? get().period);

          set({ dashboardData: stats ?? get().dashboardData });
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
    }),
    {
      name: "DashboardStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDashboardStore;
