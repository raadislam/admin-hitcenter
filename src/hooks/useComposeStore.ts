// You can use Zustand or Context. Here's a lightweight Zustand version:
import { Recipient } from "@/types/compose";
import { create } from "zustand";

type ComposeState = {
  open: boolean;
  recipients: Recipient[];
  addRecipient: (r: Recipient) => void;
  setRecipients: (r: Recipient[]) => void;
  show: () => void;
  hide: () => void;
  minimized: boolean;
  minimize: () => void;
  maximize: () => void;
};

export const useComposeStore = create<ComposeState>((set) => ({
  open: false,
  recipients: [],
  minimized: false,
  show: () => set({ open: true, minimized: false }),
  hide: () => set({ open: false, recipients: [], minimized: false }),
  minimize: () => set({ minimized: true }),
  maximize: () => set({ minimized: false }),
  addRecipient: (r) =>
    set((s) => ({ recipients: [...s.recipients, r], open: true })),
  setRecipients: (r) => set({ recipients: r }),
}));
