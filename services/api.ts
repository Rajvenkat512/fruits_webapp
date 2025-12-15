import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_PATH;

console.log("=== API Configuration ===");
console.log("API_URL:", API_URL);
console.log("API_BASE:", API_BASE);
console.log("Full baseURL:", `${API_URL}${API_BASE}`);

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}${API_BASE}`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (userId) {
        config.headers["x-user-id"] = userId;
      }

      // Log the actual request URL
      console.log("=== API Request ===");
      console.log("URL:", config.url);
      console.log("Full URL:", `${config.baseURL}${config.url}`);
      console.log("Method:", config.method);
      console.log("Headers:", config.headers);
      console.log("userId:", userId);
      console.log("token:", token ? "present" : "missing");

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
