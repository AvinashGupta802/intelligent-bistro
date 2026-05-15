import { create } from 'zustand';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: CartItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.menuItemId === item.menuItemId
      );
      let newItems;
      if (existingItem) {
        newItems = state.items.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: parseFloat(newTotal.toFixed(2)) };
    }),

  removeItem: (menuItemId: string) =>
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.menuItemId !== menuItemId
      );
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: parseFloat(newTotal.toFixed(2)) };
    }),

  updateQuantity: (menuItemId: string, quantity: number) =>
    set((state) => {
      let newItems;
      if (quantity === 0) {
        newItems = state.items.filter(
          (item) => item.menuItemId !== menuItemId
        );
      } else {
        newItems = state.items.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        );
      }
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: parseFloat(newTotal.toFixed(2)) };
    }),

  clearCart: () =>
    set(() => ({
      items: [],
      total: 0,
    })),

  setCart: (items: CartItem[]) =>
    set(() => {
      const newTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items, total: parseFloat(newTotal.toFixed(2)) };
    }),
}));
