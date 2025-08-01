// src/lib/axios.ts
import axios, { AxiosError } from "axios";

// Base URL from env, fallback as needed
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://hitcenter-api.test/api";

const api = axios.create({
  baseURL,
  timeout: 12000,
});

// Attach Bearer token from localStorage (browser only)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("hitcenter_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors (e.g., 401)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hitcenter_token");
        // Optionally: window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
