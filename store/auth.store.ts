import { create } from "zustand";
import { authService } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  userId: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password });

      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("userId", response.user.id);

      set({
        token: response.token,
        userId: response.user.id,
        user: response.user,
        isLoading: false,
      });
    } catch (error: any) {
      let errorMessage = "Login failed";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to server. Check API_URL in .env";
      } else if (error.code === "ETIMEDOUT") {
        errorMessage = "Request timeout. Server may be down";
      }
      
      console.error("Login failed:", {
        email,
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data,
        code: error.code,
        message: error.message,
      });
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email, password, name, role) => {
    try {
      set({ isLoading: true, error: null });
      await authService.register({ email, password, name });

      // After registration, automatically login to generate token
      const loginResponse = await authService.login({ email, password });

      await AsyncStorage.setItem("token", loginResponse.token);
      await AsyncStorage.setItem("userId", loginResponse.user.id);

      set({
        token: loginResponse.token,
        userId: loginResponse.user.id,
        user: loginResponse.user,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      console.error("Registration failed:", {
        email,
        name,
        role,
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data,
      });
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      set({ token: null, userId: null, user: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  restoreToken: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (token && userId) {
        set({ token, userId });
      }
    } catch (error) {
      console.error("Restore token error:", error);
    }
  },

  clearError: () => set({ error: null }),
}));
