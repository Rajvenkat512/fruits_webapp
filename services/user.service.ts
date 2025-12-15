import api from "./api";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  avatar?: string;
}

export const userService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>("/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await api.put<UserProfile>("/profile", payload);
    return response.data;
  },
};
