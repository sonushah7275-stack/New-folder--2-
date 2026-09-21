import axios from "axios";

/**
 * Centralized Axios instance for TEJOVA Public Frontend.
 * Reads backend base URL from VITE_API_URL environment variable.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
