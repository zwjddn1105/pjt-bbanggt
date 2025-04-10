"use client";

import { create } from "zustand";

interface VendingMachineStyleState {
  use3DStyle: boolean;
  toggleStyle: () => void;
}

export const useVendingMachineStyle = create<VendingMachineStyleState>(
  (set) => ({
    use3DStyle: false,
    toggleStyle: () => set((state) => ({ use3DStyle: !state.use3DStyle })),
  })
);
