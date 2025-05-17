import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import User from "@/models/user.model";
import UserApi from "@/api/user.api";
import PaginatedUsers from "@/models/paginated_user.model";
import { AxiosError } from "axios";
import { extractAxiosError } from "@/utils/functions.util";

interface UserStore {
  paginatedUsers: PaginatedUsers;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (newPage: number) => void;
  setPageSize: (newPageSize: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  fetchUsers: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  addUser: (user: User) => Promise<User | string | undefined>;
  updateUser: (user: User) => Promise<User | string | undefined>;
  blockUser: (userId: string) => Promise<boolean | undefined>;
  deleteUser: (
    userId: string,
    adminPassword: string,
  ) => Promise<boolean | undefined>;
}

const useUsersStore = create<UserStore>()(
  persist(
    (set, get) => ({
      paginatedUsers: new PaginatedUsers(0, null, null, []),
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,

      setPage: (newPage: number) => set({ page: newPage }),

      increasePage: () =>
        set((state) => ({
          page: state.page + 1,
        })),

      decreasePage: () =>
        set((state) => ({
          page: state.page - 1,
        })),

      setPageSize: (newPageSize: number) => set({ pageSize: newPageSize }),

      fetchUsers: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null, page: page ?? get().page });
        try {
          const paginatedUsers = await UserApi.findMany(
            searchField,
            page ?? get().page,
            pageSize ?? get().pageSize,
          );

          set((state) => ({
            paginatedUsers: paginatedUsers,
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

      addUser: async (user: User) => {
        set({ error: null });
        try {
          const addedUser = await UserApi.add(user);
          set((state) => ({
            paginatedUsers: new PaginatedUsers(
              state.paginatedUsers.count + 1,
              state.paginatedUsers.next,
              state.paginatedUsers.previous,
              [...state.paginatedUsers.results, addedUser],
            ),
          }));
          return addedUser;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateUser: async (user: User) => {
        set({ error: null });
        try {
          const updatedUser = await UserApi.update(user);
          set((state) => ({
            paginatedUsers: new PaginatedUsers(
              state.paginatedUsers.count,
              state.paginatedUsers.next,
              state.paginatedUsers.previous,
              state.paginatedUsers.results.map((u) =>
                u.id === user.id ? updatedUser : u,
              ),
            ),
          }));
          return updatedUser;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      blockUser: async (userId: string) => {
        set({ error: null });
        try {
          const user = get().paginatedUsers.results.find(
            (user) => user.id === userId,
          );
          await UserApi.block(user!);
          set((state) => {
            user!.isBlock = !user!.isBlock;
            return {
              paginatedUsers: new PaginatedUsers(
                state.paginatedUsers.count,
                state.paginatedUsers.next,
                state.paginatedUsers.previous,
                state.paginatedUsers.results.map((u) =>
                  u.id === user!.id ? user! : u,
                ),
              ),
            };
          });
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

      deleteUser: async (userId: string, adminPassword: string) => {
        set({ error: null });
        try {
          await UserApi.remove(userId, adminPassword);
          set((state) => ({
            paginatedUsers: new PaginatedUsers(
              state.paginatedUsers.count - 1,
              state.paginatedUsers.next,
              state.paginatedUsers.previous,
              state.paginatedUsers.results.filter((user) => user.id !== userId),
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
      name: "usersStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUsersStore;
