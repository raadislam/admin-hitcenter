// src/lib/axios.ts

import axios, { AxiosError } from "axios";

// --- Base URL: automatically use .env variable for production or fallback to local --- //
const baseURL =
  process.env.NEXT_PUBLIC_PRODUCTION_MODE === "true"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://hitcenter-api.test/api";

// --- Create a custom axios instance --- //
const api = axios.create({
  baseURL,
  // If you use Sanctum/cookie auth, keep withCredentials: true. For JWT, you can leave it out.
  // withCredentials: true,
  timeout: 12000, // 12s timeout, tweak as needed
});

// --- AUTH TOKEN INTERCEPTOR: Adds token from localStorage on every request --- //
api.interceptors.request.use(
  (config) => {
    // This runs in the browser, not SSR!
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

// --- GLOBAL ERROR HANDLER --- //
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401: remove token, optionally redirect or toast
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hitcenter_token");
        // Optionally, redirect to login or show toast
        // window.location.href = "/login";
      }
    }
    // Optionally, handle 403, 500 etc. with global notifications/toasts here
    return Promise.reject(error);
  }
);

export default api;
