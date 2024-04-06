import { create } from "zustand";

interface AvatarState {
  avatar: string;
  updateAvatarSrc: (src: string) => void;
}
export const useAvatar = create<AvatarState>((set) => ({
  avatar: "",
  updateAvatarSrc: (src) => set(() => ({ avatar: src })),
}));
