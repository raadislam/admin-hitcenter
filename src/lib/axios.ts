import axios from "axios";

const api = axios.create({
  baseURL: "http://hitcenter-api.test/api", // or your local Laravel API URL
  // baseURL: "https://api.hittcenter.com/api", // or your actual Laravel API URL
  withCredentials: true, // if using cookies/session
});

// In src/lib/axios.ts
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hitcenter_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
