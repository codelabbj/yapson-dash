import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import TransactionApi from "@/api/transaction.api";
import PaginatedTransaction, {
  DefaultSerializable,
} from "@/models/paginated_transaction.model";
import Transaction from "@/models/transaction.model";
import App from "@/models/app.model";
import AppApi from "@/api/app.api";
import { TransactionFiterFormData } from "../interfaces/transaction.interface";
import { AxiosError } from "axios";
import { delay, extractAxiosError } from "@/utils/functions.util";
import Service from "@/models/service.model";
import ServiceApi from "@/api/service.api";

interface TransactionStore<T extends DefaultSerializable = Transaction> {
  paginatedTransactions: PaginatedTransaction<T>;
  loading: boolean;
  error: string | null;
  filter: TransactionFiterFormData;
  page: number;
  pageSize: number;
  transactionsApps: App[];
  transactionsServices: Service[];
  setFilter: (newFilter: TransactionFiterFormData) => void;

  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchApps: () => void;
  fetchServices: () => void;
  fetchTransactions: (
    searchField?: string,
    filter?: TransactionFiterFormData,
    page?: number,
    pageSize?: number,
    isUpdate?: boolean,
    currentPage?: number,
  ) => Promise<void>;
  addTransaction: (transaction: T) => Promise<T | string | undefined>;
  updateTransaction: (transaction: T) => Promise<T | string | undefined>;
  deleteTransaction: (transactionId: string) => Promise<boolean | undefined>;
}

const createTransactionStore =
  <T extends DefaultSerializable = Transaction>(ctor: {
    new (...params: any[]): T;
    fromJson(json: any): T;
  }): StateCreator<TransactionStore<T>> =>
  (set, get) => ({
    paginatedTransactions: new PaginatedTransaction<T>(0, null, null, []),
    loading: false,
    error: null,
    page: 1,

    filter: {
      reference: "",
      status: "",
      type: "",
      countryCodeCode: "",
      phoneNumber: "",
      userAppId: "",
      mobileReference: "",
      withdriwalCode: "",
      userEmail: "",
      app: "",
      service: "",
    },

    pageSize: 10,
    transactionsApps: [],
    transactionsServices: [],

    setPage: (newPage: number) => {
      set({ page: newPage });
    },

    setPageSize: (newPageSize: number) => {
      set({ pageSize: newPageSize });
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

    setFilter: (newFilter: TransactionFiterFormData) => {
      set({ filter: newFilter });
    },

    fetchTransactions: async (
      searchField = "",
      filter,
      page,
      pageSize,
      isUpdate = false,
      currentPage = 1,
    ) => {
      if (!isUpdate)
        set({ loading: true, error: null, page: page ?? get().page });
      try {
        const paginatedTransactions = await TransactionApi.findMany(
          ctor,
          searchField,
          filter ?? get().filter,
          page ?? get().page,
          pageSize ?? get().pageSize,
        );
        console.log(paginatedTransactions);

        isUpdate
          ? set({
              paginatedTransactions,
              page: currentPage,
            })
          : set({
              paginatedTransactions,
            });
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

    fetchApps: async () => {
      try {
        const apps = await AppApi.findMany();

        set({
          transactionsApps: apps,
        });
      } catch (error) {
        set({ error: "An unknown error occurred" });
      }
    },

    fetchServices: async () => {
      try {
        const services = await ServiceApi.findMany();

        set({
          transactionsServices: services.results,
        });
      } catch (error) {
        set({ error: "An unknown error occurred" });
      }
    },

    addTransaction: async (transaction: T) => {
      set({ error: null });
      try {
        const addedTransaction = await TransactionApi.add<T>(transaction, ctor);
        set((state) => {
          const transactionsList = state.paginatedTransactions.results;

          transactionsList.push(addedTransaction);

          return {
            paginatedTransactions: new PaginatedTransaction(
              state.paginatedTransactions.count,
              state.paginatedTransactions.next,
              state.paginatedTransactions.previous,
              transactionsList,
            ),
          };
        });
        return addedTransaction;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          set({ error: extractAxiosError(error) });
          return extractAxiosError(error);
        } else {
          set({ error: "An unknown error occurred" });
        }
      }
    },
    updateTransaction: async (transaction: T) => {
      set({ error: null });
      try {
        const updatedTransaction = await TransactionApi.update<T>(
          transaction,
          ctor,
        );

        set((state) => {
          const transactionsList = state.paginatedTransactions.results;

          const unUpdatedTransactionIndex = transactionsList.findIndex(
            (t) => t.id === transaction.id,
          );

          if (unUpdatedTransactionIndex !== -1) {
            transactionsList[unUpdatedTransactionIndex] = updatedTransaction;
          }

          return {
            paginatedTransactions: new PaginatedTransaction(
              state.paginatedTransactions.count,
              state.paginatedTransactions.next,
              state.paginatedTransactions.previous,
              transactionsList,
            ),
          };
        });

        return updatedTransaction;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          set({ error: extractAxiosError(error) });
          return extractAxiosError(error);
        } else {
          set({ error: "An unknown error occurred" });
        }
      }
    },

    deleteTransaction: async (transactionId: string) => {
      set({ error: null });
      try {
        await TransactionApi.remove(transactionId);
        set((state) => ({
          paginatedTransactions: new PaginatedTransaction(
            state.paginatedTransactions.count,
            state.paginatedTransactions.next,
            state.paginatedTransactions.previous,
            state.paginatedTransactions.results.filter(
              (transaction) => transaction.id !== transactionId,
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
  });

const useTransactionStore = <
  T extends DefaultSerializable = Transaction,
>(ctor: {
  new (...params: any[]): T;
  fromJson(json: any): T;
}) => create<TransactionStore<T>>()(createTransactionStore<T>(ctor));

export default useTransactionStore;
