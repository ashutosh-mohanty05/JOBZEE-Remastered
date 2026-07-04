import axios from "axios";

// Single source of truth for the backend URL.
// Set VITE_API_URL in frontend/.env to point at your backend.
// Defaults to the local backend for local development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
});

export default api;
