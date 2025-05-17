import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ServiceBalanceApi from "@/api/service_balance.api";
import ServiceBalance from "@/models/service_balance.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface ServiceBalanceStore {
  serviceBalances: ServiceBalance[];
  servicesMainBalance: ServiceBalance | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchServiceBalances: () => Promise<void>;
  researchServiceBalances: () => Promise<ServiceBalance[] | undefined>;
  researchAddServiceBalance: (
    serviceBalance: ServiceBalance,
  ) => Promise<ServiceBalance | undefined>;
  addServiceBalance: (
    serviceBalance: ServiceBalance,
  ) => Promise<ServiceBalance | string | undefined>;
  updateServiceBalance: (
    serviceBalance: ServiceBalance,
  ) => Promise<ServiceBalance | string | undefined>;
  deleteServiceBalance: (
    serviceBalanceId: string,
  ) => Promise<boolean | undefined>;
}

const useServiceBalanceStore = create<ServiceBalanceStore>()(
  persist(
    (set, get) => ({
      serviceBalances: [],
      servicesMainBalance: null,
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

      fetchServiceBalances: async () => {
        set({ loading: true, error: null });
        try {
          const serviceBalances = await ServiceBalanceApi.findMany();
          const servicesMainBalance = await ServiceBalanceApi.findMain();

          set((state) => ({
            serviceBalances: serviceBalances,
            servicesMainBalance: servicesMainBalance,
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

      researchServiceBalances: async () => {
        set({ loading: true, error: null });
        try {
          const serviceBalances = await ServiceBalanceApi.findMany();

          return serviceBalances;
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

      researchAddServiceBalance: async (serviceBalance: ServiceBalance) => {
        set({ error: null });
        try {
          return await ServiceBalanceApi.add(serviceBalance);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addServiceBalance: async (serviceBalance: ServiceBalance) => {
        set({ error: null });
        try {
          const addedServiceBalance =
            await ServiceBalanceApi.add(serviceBalance);
          set((state) => {
            const serviceBalancesList = state.serviceBalances;

            serviceBalancesList.push(addedServiceBalance);

            return {
              serviceBalances: serviceBalancesList,
            };
          });
          return addedServiceBalance;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateServiceBalance: async (serviceBalance: ServiceBalance) => {
        set({ error: null });
        try {
          const updatedserviceBalance =
            await ServiceBalanceApi.update(serviceBalance);

          set((state) => {
            const serviceBalancesList = state.serviceBalances;

            const unUpdatedserviceBalanceIndex = serviceBalancesList.findIndex(
              (ch) => ch.id === serviceBalance.id,
            );

            if (unUpdatedserviceBalanceIndex !== -1) {
              serviceBalancesList[unUpdatedserviceBalanceIndex] =
                updatedserviceBalance;
            }

            return {
              serviceBalances: serviceBalancesList,
            };
          });

          return updatedserviceBalance;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteServiceBalance: async (serviceBalanceId: string) => {
        set({ error: null });
        try {
          await ServiceBalanceApi.remove(serviceBalanceId);
          set((state) => ({
            serviceBalances: state.serviceBalances.filter(
              (serviceBalance) => serviceBalance.id !== serviceBalanceId,
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
      name: "ServiceBalanceStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useServiceBalanceStore;
