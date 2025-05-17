import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface InterfaceStore {
  actionResultMessage: string | undefined;
  setActionResultMessage: (message: string) => void;
}

const useInterfaceStore = create<InterfaceStore>()(
  persist(
    (set, get) => ({
      actionResultMessage: "",

      setActionResultMessage: (message: string) => {
        set(() => ({ actionResultMessage: message }));
      },
    }),
    {
      name: "InterfaceStore",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useInterfaceStore;
