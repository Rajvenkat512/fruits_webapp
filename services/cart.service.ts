import api from "./api";

export interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>("/cart");
    return response.data;
  },

  // Add item to cart
  addToCart: async (payload: AddToCartPayload): Promise<CartItem> => {
    const response = await api.post<CartItem>("/cart", payload);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (
    id: string,
    payload: UpdateCartItemPayload
  ): Promise<CartItem> => {
    const response = await api.put<CartItem>(`/cart/${id}`, payload);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (id: string): Promise<void> => {
    await api.delete(`/cart/${id}`);
  },
};
