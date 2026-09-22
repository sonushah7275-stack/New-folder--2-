import axios from "axios";

/**
 * Centralized Axios instance for TEJOVA Admin Dashboard.
 * Reads backend base URL from VITE_API_URL environment variable.
 * Normalizes URL to ensure `/api` suffix is present and trailing slashes removed.
 */
const rawUrl = import.meta.env.VITE_API_URL || "https://new-folder-2-backend.onrender.com/api";
const normalizedUrl = rawUrl.replace(/\/+$/, "");
const baseURL = normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tejova_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
