import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import EventApi from "@/api/event.api";
import PaginatedEvent from "@/models/paginated_event.model";
import Event from "@/models/event.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface EventStore {
  paginatedEvents: PaginatedEvent;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setPageSize: (newPageSize: number) => void;
  fetchEvents: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchEvents: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedEvent | undefined>;
  researchAddEvent: (event: Event) => Promise<Event | undefined>;
  addEvent: (Event: Event) => Promise<Event | string | undefined>;
  updateEvent: (Event: Event) => Promise<Event | string | undefined>;
  deleteEvent: (EventId: string) => Promise<boolean | undefined>;
}

const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      paginatedEvents: new PaginatedEvent(0, null, null, []),
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

      fetchEvents: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedEvents = await EventApi.findMany(
            searchField,
            undefined,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedEvents: paginatedEvents,
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

      researchEvents: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          const paginatedClubs = EventApi.findMany(
            searchField,
            "pending",
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
      researchAddEvent: async (event: Event) => {
        set({ error: null });
        try {
          const addedEvent = await EventApi.add(event);

          return addedEvent;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addEvent: async (Event: Event) => {
        set({ error: null });
        try {
          const addedEvent = await EventApi.add(Event);
          set((state) => {
            return {
              paginatedEvents: new PaginatedEvent(
                state.paginatedEvents.count,
                state.paginatedEvents.next,
                state.paginatedEvents.previous,
                [...state.paginatedEvents.results, addedEvent],
              ),
            };
          });
          return addedEvent;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateEvent: async (Event: Event) => {
        set({ error: null });
        try {
          const updatedEvent = await EventApi.update(Event);

          set((state) => {
            return {
              paginatedEvents: new PaginatedEvent(
                state.paginatedEvents.count,
                state.paginatedEvents.next,
                state.paginatedEvents.previous,
                state.paginatedEvents.results.map((Event) =>
                  Event.id === updatedEvent.id ? updatedEvent : Event,
                ),
              ),
            };
          });

          return updatedEvent;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteEvent: async (EventId: string) => {
        set({ error: null });
        try {
          await EventApi.remove(EventId);
          set((state) => ({
            paginatedEvents: new PaginatedEvent(
              state.paginatedEvents.count - 1,
              state.paginatedEvents.next,
              state.paginatedEvents.previous,
              state.paginatedEvents.results.filter(
                (Event) => Event.id !== EventId,
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
      name: "EventStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useEventStore;
