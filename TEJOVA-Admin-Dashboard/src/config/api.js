import axios from "axios";

/**
 * Centralized Axios instance for TEJOVA Admin Dashboard.
 * Priority order for API Base URL:
 * 1. import.meta.env.VITE_API_URL (if defined and non-localhost in production)
 * 2. https://new-folder-2-backend.onrender.com/api (production default fallback)
 * 3. http://localhost:5000/api (development fallback)
 */
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProd = import.meta.env.PROD;

  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    if (isProd && envUrl.includes("localhost")) {
      return "https://new-folder-2-backend.onrender.com/api";
    }
    return envUrl;
  }

  return isProd
    ? "https://new-folder-2-backend.onrender.com/api"
    : "http://localhost:5000/api";
};

const rawUrl = getApiBaseUrl();
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
