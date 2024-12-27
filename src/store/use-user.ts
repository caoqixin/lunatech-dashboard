import { create } from "zustand";

interface UserState {
  avatar: string;
  userName: string;
  updateUserName: (newName: string) => void;
  updateAvatarSrc: (src: string) => void;
}
export const useUser = create<UserState>((set) => ({
  avatar: "",
  userName: "",
  updateUserName: (newName) => set(() => ({ userName: newName })),
  updateAvatarSrc: (src) => set(() => ({ avatar: src })),
}));
