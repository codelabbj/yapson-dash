import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AdvertisementApi from "@/api/advertisement.api";
import {
  AdvertisementFormData,
  AdvertisementFormErrors,
} from "@/interfaces/advertisement.interface";
import Advertisement from "@/models/advertisement.model";
import PaginatedAdvertisement from "@/models/paginated_advertisement.model";
import { extractAxiosError } from "@/utils/functions.util";
import { AxiosError } from "axios";

interface AdvertisementStore {
  paginatedAdvertisements: PaginatedAdvertisement;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchAdvertisements: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchAdvertisements: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedAdvertisement | undefined>;
  researchAddAdvertisement: (
    Advertisement: Advertisement,
  ) => Promise<Advertisement | undefined>;
  addAdvertisement: (
    Advertisement: Advertisement,
  ) => Promise<Advertisement | string | undefined>;
  updateAdvertisement: (
    Advertisement: Advertisement,
  ) => Promise<Advertisement | string | undefined>;
  deleteAdvertisement: (
    AdvertisementId: string,
  ) => Promise<boolean | undefined>;
}

const useAdvertisementStore = create<AdvertisementStore>()(
  persist(
    (set, get) => ({
      paginatedAdvertisements: new PaginatedAdvertisement(0, null, null, []),
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

      fetchAdvertisements: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedAdvertisements = await AdvertisementApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedAdvertisements: paginatedAdvertisements,
            /*
            new PaginatedAdvertisement(
              paginatedAdvertisements.count,
              paginatedAdvertisements.next,
              paginatedAdvertisements.previous,
              // ***** Use Set for removing repeated data (resulting from addition) ***** //
              Array.from(
                new Set([
                  ...state.paginatedAdvertisements.results,
                  ...paginatedAdvertisements.results,
                ]),
              ),
            ),
            */
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

      researchAdvertisements: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedAdvertisements = await AdvertisementApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedAdvertisements;
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
      researchAddAdvertisement: async (Advertisement: Advertisement) => {
        set({ error: null });
        try {
          const addedAdvertisement = await AdvertisementApi.add(Advertisement);

          return addedAdvertisement;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addAdvertisement: async (Advertisement: Advertisement) => {
        set({ error: null });
        try {
          const addedAdvertisement = await AdvertisementApi.add(Advertisement);
          set((state) => {
            const AdvertisementsList = state.paginatedAdvertisements.results;

            AdvertisementsList.push(addedAdvertisement);

            return {
              paginatedAdvertisements: new PaginatedAdvertisement(
                state.paginatedAdvertisements.count,
                state.paginatedAdvertisements.next,
                state.paginatedAdvertisements.previous,
                AdvertisementsList,
              ),
            };
          });
          return addedAdvertisement;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateAdvertisement: async (Advertisement: Advertisement) => {
        set({ error: null });
        try {
          const updatedAdvertisement =
            await AdvertisementApi.update(Advertisement);

          set((state) => {
            const AdvertisementsList = state.paginatedAdvertisements.results;

            const unUpdatedAdvertisementId =
              state.paginatedAdvertisements.results.findIndex(
                (clb) => clb.id === Advertisement.id,
              );

            if (unUpdatedAdvertisementId != -1) {
              AdvertisementsList[unUpdatedAdvertisementId] =
                updatedAdvertisement;
            }

            return {
              paginatedAdvertisements: new PaginatedAdvertisement(
                state.paginatedAdvertisements.count,
                state.paginatedAdvertisements.next,
                state.paginatedAdvertisements.previous,
                AdvertisementsList,
              ),
            };
          });

          return updatedAdvertisement;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteAdvertisement: async (AdvertisementId: string) => {
        set({ error: null });
        try {
          await AdvertisementApi.remove(AdvertisementId);
          set((state) => ({
            paginatedAdvertisements: new PaginatedAdvertisement(
              state.paginatedAdvertisements.count,
              state.paginatedAdvertisements.next,
              state.paginatedAdvertisements.previous,
              state.paginatedAdvertisements.results.filter(
                (Advertisement) => Advertisement.id != AdvertisementId,
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
      name: "AdvertisementStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAdvertisementStore;
