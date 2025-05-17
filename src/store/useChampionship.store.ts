import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ChampionshipApi from "@/api/championship.api";
import PaginatedChampionship from "@/models/paginated_championship.model";
import Championship from "@/models/championship.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface ChampionshipStore {
  paginatedChampionships: PaginatedChampionship;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchChampionships: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchChampionships: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedChampionship | undefined>;
  researchAddChampionship: (
    championship: Championship,
  ) => Promise<Championship | undefined>;
  addChampionship: (
    championship: Championship,
  ) => Promise<Championship | string | undefined>;
  updateChampionship: (
    championship: Championship,
  ) => Promise<Championship | string | undefined>;
  deleteChampionship: (championshipId: string) => Promise<boolean | undefined>;
}

const useChampionshipStore = create<ChampionshipStore>()(
  persist(
    (set, get) => ({
      paginatedChampionships: new PaginatedChampionship(0, null, null, []),
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

      fetchChampionships: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedChampionships = await ChampionshipApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedChampionships: paginatedChampionships,
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

      researchChampionships: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          return await ChampionshipApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );
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
      researchAddChampionship: async (club: Championship) => {
        set({ error: null });
        try {
          return await ChampionshipApi.add(club);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addChampionship: async (championship: Championship) => {
        set({ error: null });
        try {
          const addedChampionship = await ChampionshipApi.add(championship);
          set((state) => {
            const championshipsList = state.paginatedChampionships.results;

            championshipsList.push(addedChampionship);

            return {
              paginatedChampionships: new PaginatedChampionship(
                state.paginatedChampionships.count,
                state.paginatedChampionships.next,
                state.paginatedChampionships.previous,
                championshipsList,
              ),
            };
          });
          return addedChampionship;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateChampionship: async (championship: Championship) => {
        set({ error: null });
        try {
          const updatedChampionship =
            await ChampionshipApi.update(championship);

          set((state) => {
            const championshipsList = state.paginatedChampionships.results;

            const unUpdatedChampionshipIndex = championshipsList.findIndex(
              (ch) => ch.id === championship.id,
            );

            if (unUpdatedChampionshipIndex !== -1) {
              championshipsList[unUpdatedChampionshipIndex] =
                updatedChampionship;
            }

            return {
              paginatedChampionships: new PaginatedChampionship(
                state.paginatedChampionships.count,
                state.paginatedChampionships.next,
                state.paginatedChampionships.previous,
                championshipsList,
              ),
            };
          });

          return updatedChampionship;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteChampionship: async (championshipId: string) => {
        set({ error: null });
        try {
          await ChampionshipApi.remove(championshipId);
          set((state) => ({
            paginatedChampionships: new PaginatedChampionship(
              state.paginatedChampionships.count,
              state.paginatedChampionships.next,
              state.paginatedChampionships.previous,
              state.paginatedChampionships.results.filter(
                (championship) => championship.id !== championshipId,
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
      name: "championshipStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useChampionshipStore;
