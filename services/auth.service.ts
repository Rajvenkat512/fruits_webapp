import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/register", payload);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Logout is handled on client side by clearing storage
    // But you can call server endpoint if needed
  },
};
