import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Club from "@/models/club.model";
import PaginatedTicket from "@/models/paginated_ticket.model";
import Ticket from "@/models/ticket.model";
import TicketApi from "@/api/ticket.api";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";
import BetApp from "@/models/betapp.model";

interface TicketStore {
  paginatedTickets: PaginatedTicket;
  apps: BetApp[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  betapp: string;
  setBetapp: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fetchTickets: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchTickets: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedTicket | undefined>;
  researchAddTicket: (ticket: Ticket) => Promise<Ticket | undefined>;
  addTicket: (ticket: Ticket) => Promise<Ticket | string | undefined>;
  updateTicket: (ticket: Ticket) => Promise<Ticket | string | undefined>;
  deleteTicket: (ticketId: string) => Promise<boolean | undefined>;
}

const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      paginatedTickets: new PaginatedTicket(0, null, null, []),
      loading: false,
      apps: [],
      error: null,
      page: 1,
      pageSize: 10,
      betapp: "1xbet",

      setPage: (newPage: number) => {
        set({ page: newPage });
      },

      setBetapp: (e: React.ChangeEvent<HTMLSelectElement>) => {
        set({
          betapp: e.target.value,
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

      fetchTickets: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const [paginatedTickets, apps] = await Promise.all([
            TicketApi.findMany(
              searchField,
              page ?? get().page,
              pageSize ?? get().pageSize,
            ),
            TicketApi.getApps()
          ]);

          set((state) => ({
            paginatedTickets: paginatedTickets,
            apps: apps,
            /*
            new PaginatedTicket(
              paginatedTickets.count,
              paginatedTickets.next,
              paginatedTickets.previous,
              // ***** Use Set for removing repeated data (resulting from addition) ***** //
              Array.from(
                new Set([
                  ...state.paginatedTickets.results,
                  ...paginatedTickets.results,
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

      researchTickets: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedTickets = await TicketApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          return paginatedTickets;
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
      researchAddTicket: async (ticket: Ticket) => {
        set({ error: null });
        try {
          const addedClub = await TicketApi.add(ticket);

          return addedClub;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addTicket: async (ticket: Ticket) => {
        set({ error: null });
        try {
          const addedClub = await TicketApi.add(ticket);
          set((state) => {
            const clubsList = state.paginatedTickets.results;

            clubsList.push(addedClub);

            return {
              paginatedTickets: new PaginatedTicket(
                state.paginatedTickets.count,
                state.paginatedTickets.next,
                state.paginatedTickets.previous,
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

      updateTicket: async (ticket: Ticket) => {
        set({ error: null });
        try {
          const updatedClub = await TicketApi.update(ticket);

          set((state) => {
            const clubsList = state.paginatedTickets.results;

            const unUpdatedClubId = state.paginatedTickets.results.findIndex(
              (tckt) => tckt.id === ticket.id,
            );

            if (unUpdatedClubId != -1) {
              clubsList[unUpdatedClubId] = updatedClub;
            }

            return {
              paginatedTickets: new PaginatedTicket(
                state.paginatedTickets.count,
                state.paginatedTickets.next,
                state.paginatedTickets.previous,
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

      deleteTicket: async (ticketId: string) => {
        set({ error: null });
        try {
          await TicketApi.remove(ticketId);
          set((state) => ({
            paginatedTickets: new PaginatedTicket(
              state.paginatedTickets.count,
              state.paginatedTickets.next,
              state.paginatedTickets.previous,
              state.paginatedTickets.results.filter(
                (ticket) => ticket.id != ticketId,
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
      name: "TicketStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useTicketStore;
