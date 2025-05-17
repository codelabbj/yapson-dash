import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ComplaintApi from "@/api/complaint.api";
import PaginatedComplaint from "@/models/paginated_complaint.model";
import Complaint from "@/models/complaint.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface ComplaintStore {
  paginatedComplaints: PaginatedComplaint;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchComplaints: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  addComplaint: (
    complaint: Complaint,
  ) => Promise<Complaint | string | undefined>;
  updateComplaint: (
    complaint: Complaint,
  ) => Promise<Complaint | string | undefined>;
  deleteComplaint: (complaintId: string) => Promise<boolean | undefined>;
}

const useComplaintStore = create<ComplaintStore>()(
  persist(
    (set, get) => ({
      paginatedComplaints: new PaginatedComplaint(0, null, null, []),
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

      fetchComplaints: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedComplaints = await ComplaintApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedComplaints: paginatedComplaints,
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

      addComplaint: async (complaint: Complaint) => {
        set({ error: null });
        try {
          const addedComplaint = await ComplaintApi.add(complaint);
          set((state) => {
            const complaintsList = state.paginatedComplaints.results;

            complaintsList.push(addedComplaint);

            return {
              paginatedComplaints: new PaginatedComplaint(
                state.paginatedComplaints.count,
                state.paginatedComplaints.next,
                state.paginatedComplaints.previous,
                complaintsList,
              ),
            };
          });
          return addedComplaint;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateComplaint: async (complaint: Complaint) => {
        set({ error: null });
        try {
          const updatedComplaint = await ComplaintApi.update(complaint);

          set((state) => {
            const complaintsList = state.paginatedComplaints.results;

            const unUpdatedComplaintIndex = complaintsList.findIndex(
              (ch) => ch.id === complaint.id,
            );

            if (unUpdatedComplaintIndex !== -1) {
              complaintsList[unUpdatedComplaintIndex] = updatedComplaint;
            }

            return {
              paginatedComplaints: new PaginatedComplaint(
                state.paginatedComplaints.count,
                state.paginatedComplaints.next,
                state.paginatedComplaints.previous,
                complaintsList,
              ),
            };
          });

          return updatedComplaint;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteComplaint: async (complaintId: string) => {
        set({ error: null });
        try {
          await ComplaintApi.remove(complaintId);
          set((state) => ({
            paginatedComplaints: new PaginatedComplaint(
              state.paginatedComplaints.count,
              state.paginatedComplaints.next,
              state.paginatedComplaints.previous,
              state.paginatedComplaints.results.filter(
                (complaint) => complaint.id !== complaintId,
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
      name: "complaintStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useComplaintStore;
