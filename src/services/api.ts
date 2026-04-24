import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Obrigatório para gerenciar HttpOnly Cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de resposta para lidar com expiração de sessão
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  },
);

export default api;
