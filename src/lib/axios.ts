// src/lib/axios.ts
import axios, { AxiosError } from "axios";

// Automatically use .env for switching environments
const baseURL = "http://hitcenter-api.test/api";
// process.env.NEXT_PUBLIC_API_URL || "http://hitcenter-api.test/api"; // Fallback to production

const api = axios.create({
  baseURL,
  withCredentials: true, // If using Laravel Sanctum/Cookie auth
  timeout: 12000, // 12s timeout for slow APIs
});

// ---- AUTH TOKEN INTERCEPTOR ----
api.interceptors.request.use(
  (config) => {
    // Use localStorage or cookies for token, as per your setup
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("hitcenter_token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- GLOBAL ERROR HANDLER ----
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Add more global error handling if you want
    // For example: handle 401 logout or show toast
    if (error.response?.status === 401) {
      // Optionally clear token and redirect to login
      localStorage.removeItem("hitcenter_token");
      // window.location.href = "/login"; // or show modal, etc.
    }
    return Promise.reject(error);
  }
);

export default api;
