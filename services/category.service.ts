import api from "./api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  image?: string;
  description?: string;
}

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/admin/categories");
    return response.data;
  },

  // Get single category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/admin/categories/${id}`);
    return response.data;
  },

  // Create category
  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const response = await api.post<Category>("/admin/categories", payload);
    return response.data;
  },

  // Update category
  update: async (
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> => {
    const response = await api.put<Category>(`/admin/categories/${id}`, payload);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};
