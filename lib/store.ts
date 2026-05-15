import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateMenge: (id: string, menge: number) => void;
  clear: () => void;
  totalBrutto: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            },
          ],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateMenge: (id, menge) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, menge: Math.max(1, menge) } : i
          ),
        })),

      clear: () => set({ items: [] }),

      totalBrutto: () =>
        get().items.reduce((sum, i) => sum + i.preis * i.menge, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.menge, 0),
    }),
    { name: "gzn-cart-v1" }
  )
);
