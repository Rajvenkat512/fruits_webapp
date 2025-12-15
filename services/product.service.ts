import api from "./api";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
  category?: { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
}

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  stock?: number;
  categoryId?: string;
}

export const productService = {
  // Get all products
  getAll: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Product[]> => {
    const response = await api.get<Product[]>("/admin/products", { params });
    return response.data;
  },

  // Get single product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/admin/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await api.post<Product>("/admin/products", payload);
    return response.data;
  },

  // Update product
  update: async (
    id: string,
    payload: UpdateProductPayload
  ): Promise<Product> => {
    const response = await api.put<Product>(`/admin/products/${id}`, payload);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
};
