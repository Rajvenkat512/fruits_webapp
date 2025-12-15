import { create } from "zustand";
import { watchlistService, WatchlistItem } from "@/services/watchlist.service";

interface WatchlistStore {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
  fetchWatchlist: () => Promise<void>;
  addToWatchlist: (productId: string) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  clearError: () => void;
  isInWatchlist: (productId: string) => boolean;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWatchlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const items = await watchlistService.getWatchlist();
      set({ items, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch watchlist",
        isLoading: false,
      });
    }
  },

  addToWatchlist: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const newItem = await watchlistService.addToWatchlist({ productId });
      set({ items: [...get().items, newItem], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to add to watchlist",
        isLoading: false,
      });
    }
  },

  removeFromWatchlist: async (itemId) => {
    try {
      set({ isLoading: true, error: null });
      await watchlistService.removeFromWatchlist(itemId);
      set({
        items: get().items.filter((item) => item._id !== itemId),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to remove from watchlist",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  isInWatchlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));
