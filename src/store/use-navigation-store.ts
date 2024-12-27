import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavigationState {
  title: string;
  setTitle: (title: string) => void;
}
export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      title: "",
      setTitle: (title) => set(() => ({ title: title })),
    }),
    {
      name: "title",
    }
  )
);
