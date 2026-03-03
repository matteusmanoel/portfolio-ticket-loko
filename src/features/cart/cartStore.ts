import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/catalog'

const STORAGE_KEY = 'tl_roteiro'

interface CartState {
  items: CartItem[]
  groupDetails: string
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  setGroupDetails: (value: string) => void
  isInCart: (id: string) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      groupDetails: '',
      addItem: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id) ? s : { items: [...s.items, item] }
        ),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      setGroupDetails: (value) => set({ groupDetails: value }),
      isInCart: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ items: s.items, groupDetails: s.groupDetails }),
    }
  )
)
