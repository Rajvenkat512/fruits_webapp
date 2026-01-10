import { create } from "zustand";
import { cartService, CartItem } from "@/services/cart.service";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearError: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const items = await cartService.getCart();
      const normalizedItems = items.map(item => ({
        ...item,
        _id: item._id || (item as any).id
      }));
      set({ items: normalizedItems, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch cart",
        isLoading: false,
      });
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      const newItem = await cartService.addToCart({ productId, quantity });
      const normalizedItem = { ...newItem, _id: newItem._id || (newItem as any).id };

      const currentItems = get().items;
      const existingItemIndex = currentItems.findIndex(item => item._id === normalizedItem._id);

      if (existingItemIndex > -1) {
        // Item exists, update it
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = normalizedItem;
        set({ items: updatedItems, isLoading: false });
      } else {
        // Item doesn't exist, append it
        set({ items: [...currentItems, normalizedItem], isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to add item",
        isLoading: false,
      });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      const updatedItem = await cartService.updateCartItem(itemId, {
        quantity,
      });
      const normalizedUpdatedItem = { ...updatedItem, _id: updatedItem._id || (updatedItem as any).id };
      set({
        items: get().items.map((item) =>
          item._id === itemId ? normalizedUpdatedItem : item
        ),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update item",
        isLoading: false,
      });
    }
  },

  removeFromCart: async (itemId) => {
    try {
      set({ isLoading: true, error: null });
      await cartService.removeFromCart(itemId);
      set({
        items: get().items.filter((item) => item._id !== itemId),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to remove item",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
