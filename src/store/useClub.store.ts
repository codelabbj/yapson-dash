import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ClubApi from "@/api/club.api";
import { ClubFormData, ClubFormErrors } from "@/interfaces/club.interface";
import Club from "@/models/club.model";
import PaginatedClub from "@/models/paginated_club.model";
import { extractAxiosError } from "@/utils/functions.util";
import { AxiosError } from "axios";

interface ClubStore {
  paginatedClubs: PaginatedClub;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchClubs: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchClubs: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedClub | undefined>;
  researchAddClub: (club: Club) => Promise<Club | undefined>;
  addClub: (club: Club) => Promise<Club | string | undefined>;
  updateClub: (club: Club) => Promise<Club | string | undefined>;
  deleteClub: (clubId: string) => Promise<boolean | undefined>;
}

const useClubStore = create<ClubStore>()(
  persist(
    (set, get) => ({
      paginatedClubs: new PaginatedClub(0, null, null, []),
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

      fetchClubs: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedClubs = await ClubApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedClubs: paginatedClubs,
            /*
            new PaginatedClub(
              paginatedClubs.count,
              paginatedClubs.next,
              paginatedClubs.previous,
              // ***** Use Set for removing repeated data (resulting from addition) ***** //
              Array.from(
                new Set([
                  ...state.paginatedClubs.results,
                  ...paginatedClubs.results,
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

      researchClubs: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedClubs = await ClubApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedClubs;
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
      researchAddClub: async (club: Club) => {
        set({ error: null });
        try {
          const addedClub = await ClubApi.add(club);

          return addedClub;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addClub: async (club: Club) => {
        set({ error: null });
        try {
          const addedClub = await ClubApi.add(club);
          set((state) => {
            const clubsList = state.paginatedClubs.results;

            clubsList.push(addedClub);

            return {
              paginatedClubs: new PaginatedClub(
                state.paginatedClubs.count,
                state.paginatedClubs.next,
                state.paginatedClubs.previous,
                clubsList,
              ),
            };
          });
          return addedClub;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateClub: async (club: Club) => {
        set({ error: null });
        try {
          const updatedClub = await ClubApi.update(club);

          set((state) => {
            const clubsList = state.paginatedClubs.results;

            const unUpdatedClubId = state.paginatedClubs.results.findIndex(
              (clb) => clb.id === club.id,
            );

            if (unUpdatedClubId != -1) {
              clubsList[unUpdatedClubId] = updatedClub;
            }

            return {
              paginatedClubs: new PaginatedClub(
                state.paginatedClubs.count,
                state.paginatedClubs.next,
                state.paginatedClubs.previous,
                clubsList,
              ),
            };
          });

          return updatedClub;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteClub: async (clubId: string) => {
        set({ error: null });
        try {
          await ClubApi.remove(clubId);
          set((state) => ({
            paginatedClubs: new PaginatedClub(
              state.paginatedClubs.count,
              state.paginatedClubs.next,
              state.paginatedClubs.previous,
              state.paginatedClubs.results.filter((club) => club.id != clubId),
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
      name: "clubStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useClubStore;
