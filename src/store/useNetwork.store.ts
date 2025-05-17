import Network from "@/models/network.model";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ClubApi from "@/api/club.api";
import Club from "@/models/club.model";
import PaginatedClub from "@/models/paginated_club.model";
import { extractAxiosError } from "@/utils/functions.util";
import { AxiosError } from "axios";
import NetworkApi from "@/api/network.api";

interface NetworkStore {
  networks: Network[];
  loading: boolean;
  error: string | null;
  fetchNetwork: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<void>;
  researchNetwork: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<Network[] | undefined>;
  researchAddNetwork: (network: Network) => Promise<Network | undefined>;
  addNetwork: (network: Network) => Promise<Network | string | undefined>;
  updateNetwork: (network: Network) => Promise<Network | string | undefined>;
  deleteNetwork: (networkId: string) => Promise<boolean | undefined>;
}

const useNetworkStore = create<NetworkStore>()(
  persist(
    (set, get) => ({
      networks: [] as Network[],
      loading: false,
      error: null,
      fetchNetwork: async (searchField = "") => {
        set({ loading: true, error: null });
        try {
          const networks = await NetworkApi.findMany(searchField);

          set((state) => ({
            networks: networks,
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

      researchNetwork: async (searchField = "", page, pageSize) => {
        set({ loading: true, error: null });
        try {
          return await NetworkApi.findMany(searchField);
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
      researchAddNetwork: async (network: Network) => {
        set({ error: null });
        try {
          return await NetworkApi.add(network);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      addNetwork: async (network: Network) => {
        set({ error: null });
        try {
          const addedNetwork = await NetworkApi.add(network);
          set((state) => {
            const networksList = state.networks;

            networksList.push(addedNetwork);

            return {
              networks: networksList,
            };
          });
          return addedNetwork;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      updateNetwork: async (network: Network) => {
        set({ error: null });
        try {
          const updatedNetwork = await NetworkApi.update(network);

          set((state) => {
            const networksList = state.networks;

            const unUpdatedNetworkId = state.networks.findIndex(
              (clb) => clb.id === network.id,
            );

            if (unUpdatedNetworkId != -1) {
              networksList[unUpdatedNetworkId] = updatedNetwork;
            }

            return {
              networks: networksList,
            };
          });

          return updatedNetwork;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            set({ error: extractAxiosError(error) });
            return extractAxiosError(error);
          } else {
            set({ error: "An unknown error occurred" });
          }
        }
      },

      deleteNetwork: async (networkId: string) => {
        set({ error: null });
        try {
          await NetworkApi.remove(networkId);
          set((state) => ({
            // paginatedClubs: new PaginatedClub(
            //   state.paginatedClubs.count,
            //   state.paginatedClubs.next,
            //   state.paginatedClubs.previous,
            //   state.paginatedClubs.results.filter((club) => club.id != clubId),
            // ),
            networks: state.networks.filter((club) => club.id != networkId),
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
      name: "networkStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useNetworkStore;
