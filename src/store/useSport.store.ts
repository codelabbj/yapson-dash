import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import SportApi from "@/api/sport.api";
import PaginatedSport from "@/models/paginated_sport.model";
import Sport from "@/models/sport.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface SportStore {
  paginatedSports: PaginatedSport;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchSports: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchSports: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedSport | undefined>;
  researchAddSport: (club: Sport) => Promise<Sport | undefined>;
  addSport: (sport: Sport) => Promise<Sport | string | undefined>;
  updateSport: (sport: Sport) => Promise<Sport | string | undefined>;
  deleteSport: (sportId: string) => Promise<boolean | undefined>;
}

const useSportStore = create<SportStore>()(
  persist(
    (set, get) => ({
      paginatedSports: new PaginatedSport(0, null, null, []),
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

      fetchSports: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedSports = await SportApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedSports: paginatedSports,
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

      researchSports: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedSports = await SportApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedSports;
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
      researchAddSport: async (sport: Sport) => {
        set({ error: null });
        try {
          return await SportApi.add(sport);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addSport: async (sport: Sport) => {
        set({ error: null });
        try {
          const addedSport = await SportApi.add(sport);
          set((state) => {
            const sportsList = state.paginatedSports.results;

            sportsList.push(addedSport);

            return {
              paginatedSports: new PaginatedSport(
                state.paginatedSports.count,
                state.paginatedSports.next,
                state.paginatedSports.previous,
                sportsList,
              ),
            };
          });
          return addedSport;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateSport: async (sport: Sport) => {
        set({ error: null });
        try {
          const updatedsport = await SportApi.update(sport);

          set((state) => {
            const sportsList = state.paginatedSports.results;

            const unUpdatedsportIndex = sportsList.findIndex(
              (ch) => ch.id === sport.id,
            );

            if (unUpdatedsportIndex !== -1) {
              sportsList[unUpdatedsportIndex] = updatedsport;
            }

            return {
              paginatedSports: new PaginatedSport(
                state.paginatedSports.count,
                state.paginatedSports.next,
                state.paginatedSports.previous,
                sportsList,
              ),
            };
          });

          return updatedsport;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteSport: async (sportId: string) => {
        set({ error: null });
        try {
          await SportApi.remove(sportId);
          set((state) => ({
            paginatedSports: new PaginatedSport(
              state.paginatedSports.count,
              state.paginatedSports.next,
              state.paginatedSports.previous,
              state.paginatedSports.results.filter(
                (sport) => sport.id !== sportId,
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
      name: "SportStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSportStore;
