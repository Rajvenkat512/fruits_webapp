import api from "./api";

export interface WatchlistItem {
  _id: string;
  userId: string;
  productId: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToWatchlistPayload {
  productId: string;
}

export const watchlistService = {
  // Get user's watchlist
  getWatchlist: async (): Promise<WatchlistItem[]> => {
    const response = await api.get<WatchlistItem[]>("/watchlist");
    return response.data;
  },

  // Add item to watchlist
  addToWatchlist: async (
    payload: AddToWatchlistPayload
  ): Promise<WatchlistItem> => {
    const response = await api.post<WatchlistItem>("/watchlist", payload);
    return response.data;
  },

  // Remove item from watchlist
  removeFromWatchlist: async (id: string): Promise<void> => {
    await api.delete(`/watchlist/${id}`);
  },
};
