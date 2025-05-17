import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SearchStore {
  searchValue: string;
  setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetSearchValue: () => void;
}

const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      searchValue: "",
      setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => {
        set({ searchValue: e.target.value });
      },

      resetSearchValue: () => {
        set({ searchValue: "" });
      },
    }),
    {
      name: "SearchStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSearchStore;
