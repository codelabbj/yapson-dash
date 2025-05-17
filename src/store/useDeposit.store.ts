import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import DepositApi from "@/api/deposit.api";
import PaginatedDeposit from "@/models/paginated_deposit.model";
import Deposit from "@/models/deposit.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";
import { depositStatus } from "@/hooks/forms/useDepositForm.hook";

interface DepositStore {
  paginatedDeposits: PaginatedDeposit;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  status: string;
  setStatus: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fetchDeposits: (
    searchField?: string,
    status?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchDeposits: (
    searchField?: string,
    status?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedDeposit | undefined>;
  researchAddDeposit: (deposit: Deposit) => Promise<Deposit | undefined>;
  addDeposit: (
    deposit: Deposit,
    app_id: string,
  ) => Promise<Deposit | string | undefined>;
  addXbetDeposit: (deposit: Deposit) => Promise<Deposit | string | undefined>;
  updateDeposit: (
    deposit: Deposit,
    bet_app_id: string,
  ) => Promise<Deposit | string | undefined>;
  deleteDeposit: (DepositId: string) => Promise<boolean | undefined>;
}

const useDepositStore = create<DepositStore>()(
  persist(
    (set, get) => ({
      paginatedDeposits: new PaginatedDeposit(0, null, null, []),
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      status: "pending",

      setPage: (newPage: number) => {
        set({ page: newPage });
      },

      setStatus: (e: React.ChangeEvent<HTMLSelectElement>) => {
        set({
          status:
            depositStatus.find((status) => status.name === e.target.value)
              ?.value ?? "pending",
        });
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

      fetchDeposits: async (searchField = "", status, page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedDeposits = await DepositApi.findMany(
            searchField,
            status ?? get().status,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedDeposits: paginatedDeposits,
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

      researchDeposits: async (searchField = "", status, page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedDeposits = await DepositApi.findMany(
            searchField,
            get().status,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedDeposits;
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
      researchAddDeposit: async (deposit: Deposit) => {
        return deposit;
        // try {
        //   return await DepositApi.add(deposit, );
        // } catch (error: unknown) {
        //   if (error instanceof AxiosError) {
        //     set({ error: extractAxiosError(error) });
        //   } else {
        //     set({ error: "An unknown error occurred" });
        //   }
        // }
      },

      addDeposit: async (deposit: Deposit, app_id: string) => {
        set({ error: null });
        try {
          const addedDeposit = await DepositApi.add(deposit, app_id);
          set((state) => {
            const DepositsList = state.paginatedDeposits.results;

            DepositsList.push(addedDeposit);

            return {
              paginatedDeposits: new PaginatedDeposit(
                state.paginatedDeposits.count,
                state.paginatedDeposits.next,
                state.paginatedDeposits.previous,
                DepositsList,
              ),
            };
          });
          return addedDeposit;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addXbetDeposit: async (deposit: Deposit) => {
        set({ error: null });
        try {
          const addedDeposit = await DepositApi.addXbet(deposit);

          return addedDeposit;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateDeposit: async (Deposit: Deposit, bet_app_id: string) => {
        set({ error: null });
        try {
          const updatedDeposit = await DepositApi.update(Deposit, bet_app_id);

          set((state) => {
            const DepositsList = state.paginatedDeposits.results;

            const unUpdatedDepositIndex = DepositsList.findIndex(
              (ch) => ch.id === Deposit.id,
            );

            if (unUpdatedDepositIndex !== -1) {
              DepositsList[unUpdatedDepositIndex] = updatedDeposit;
            }

            return {
              paginatedDeposits: new PaginatedDeposit(
                state.paginatedDeposits.count,
                state.paginatedDeposits.next,
                state.paginatedDeposits.previous,
                DepositsList,
              ),
            };
          });

          return updatedDeposit;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteDeposit: async (DepositId: string) => {
        set({ error: null });
        try {
          await DepositApi.remove(DepositId);
          set((state) => ({
            paginatedDeposits: new PaginatedDeposit(
              state.paginatedDeposits.count,
              state.paginatedDeposits.next,
              state.paginatedDeposits.previous,
              state.paginatedDeposits.results.filter(
                (Deposit) => Deposit.id !== DepositId,
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
      name: "DepositStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDepositStore;
