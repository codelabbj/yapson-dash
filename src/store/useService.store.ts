import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ServiceApi from "@/api/service.api";
import Service from "@/models/service.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";
import PaginatedService from "@/models/paginated_service.model";

interface ServiceStore {
  paginatedServices: PaginatedService;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchServices: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchServices: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedService | undefined>;
  researchAddService: (service: Service) => Promise<Service | undefined>;
  addService: (service: Service) => Promise<Service | string | undefined>;
  updateService: (service: Service) => Promise<Service | string | undefined>;
  deleteService: (serviceId: string) => Promise<boolean | undefined>;
}

const useServiceStore = create<ServiceStore>()(
  persist(
    (set, get) => ({
      paginatedServices: new PaginatedService(0, null, null, []),

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

      fetchServices: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedServices = await ServiceApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedServices: paginatedServices,
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

      researchServices: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedServices = await ServiceApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedServices;
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

      researchAddService: async (service: Service) => {
        set({ error: null });
        try {
          return await ServiceApi.add(service);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addService: async (service: Service) => {
        set({ error: null });
        try {
          const addedService = await ServiceApi.add(service);

          set((state) => {
            const servicesList = state.paginatedServices.results;

            servicesList.push(addedService);

            return {
              paginatedServices: new PaginatedService(
                state.paginatedServices.count,
                state.paginatedServices.next,
                state.paginatedServices.previous,
                servicesList,
              ),
            };
          });
          return addedService;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateService: async (service: Service) => {
        set({ error: null });
        try {
          const updatedservice = await ServiceApi.update(service);

          set((state) => {
            const servicesList = state.paginatedServices.results;

            const unUpdatedserviceIndex = servicesList.findIndex(
              (ch) => ch.id === service.id,
            );

            if (unUpdatedserviceIndex !== -1) {
              servicesList[unUpdatedserviceIndex] = updatedservice;
            }

            return {
              paginatedServices: new PaginatedService(
                state.paginatedServices.count,
                state.paginatedServices.next,
                state.paginatedServices.previous,
                servicesList,
              ),
            };
          });

          return updatedservice;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteService: async (serviceId: string) => {
        set({ error: null });
        try {
          await ServiceApi.remove(serviceId);
          set((state) => ({
            paginatedServices: new PaginatedService(
              state.paginatedServices.count,
              state.paginatedServices.next,
              state.paginatedServices.previous,
              state.paginatedServices.results.filter(
                (service) => service.id !== serviceId,
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
      name: "ServiceStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useServiceStore;
