import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ComplaintResponseApi from "@/api/complaint_response.api";
import PaginatedComplaintResponse from "@/models/paginated_complaint_response.model";
import ComplaintResponse from "@/models/complaint_response.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface ComplaintResponseStore {
  paginatedComplaintResponses: PaginatedComplaintResponse;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchComplaintResponses: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  addComplaintResponse: (
    complaintResponse: ComplaintResponse,
  ) => Promise<ComplaintResponse | string | undefined>;
  updateComplaintResponse: (
    complaintResponse: ComplaintResponse,
  ) => Promise<ComplaintResponse | string | undefined>;
  deleteComplaintResponse: (
    complaintResponseId: string,
  ) => Promise<boolean | undefined>;
}

const useComplaintResponseStore = create<ComplaintResponseStore>()(
  persist(
    (set, get) => ({
      paginatedComplaintResponses: new PaginatedComplaintResponse(
        0,
        null,
        null,
        [],
      ),
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

      fetchComplaintResponses: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedComplaintResponses =
            await ComplaintResponseApi.findMany(
              searchField,
              page ?? get().page,
              pageSize ?? get().pageSize,
            );

          set((state) => ({
            paginatedComplaintResponses: paginatedComplaintResponses,
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

      addComplaintResponse: async (complaintResponse: ComplaintResponse) => {
        set({ error: null });
        try {
          const addedComplaintResponse =
            await ComplaintResponseApi.add(complaintResponse);
          set((state) => {
            const complaintResponsesList =
              state.paginatedComplaintResponses.results;

            complaintResponsesList.push(addedComplaintResponse);

            return {
              paginatedComplaintResponses: new PaginatedComplaintResponse(
                state.paginatedComplaintResponses.count,
                state.paginatedComplaintResponses.next,
                state.paginatedComplaintResponses.previous,
                complaintResponsesList,
              ),
            };
          });
          return addedComplaintResponse;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateComplaintResponse: async (complaintResponse: ComplaintResponse) => {
        set({ error: null });
        try {
          const updatedComplaintResponse =
            await ComplaintResponseApi.update(complaintResponse);

          set((state) => {
            const complaintResponsesList =
              state.paginatedComplaintResponses.results;

            const unUpdatedComplaintResponseIndex =
              complaintResponsesList.findIndex(
                (ch) => ch.id === complaintResponse.id,
              );

            if (unUpdatedComplaintResponseIndex !== -1) {
              complaintResponsesList[unUpdatedComplaintResponseIndex] =
                updatedComplaintResponse;
            }

            return {
              paginatedComplaintResponses: new PaginatedComplaintResponse(
                state.paginatedComplaintResponses.count,
                state.paginatedComplaintResponses.next,
                state.paginatedComplaintResponses.previous,
                complaintResponsesList,
              ),
            };
          });

          return updatedComplaintResponse;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteComplaintResponse: async (complaintResponseId: string) => {
        set({ error: null });
        try {
          await ComplaintResponseApi.remove(complaintResponseId);
          set((state) => ({
            paginatedComplaintResponses: new PaginatedComplaintResponse(
              state.paginatedComplaintResponses.count,
              state.paginatedComplaintResponses.next,
              state.paginatedComplaintResponses.previous,
              state.paginatedComplaintResponses.results.filter(
                (complaintResponse) =>
                  complaintResponse.id !== complaintResponseId,
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
      name: "complaintResponseStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useComplaintResponseStore;
