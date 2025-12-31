import axios from 'axios';

/**
 * Pre-configured axios instance for backend communication
 */
export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required for cookies/sessions
});

/**
 * Interceptor for global error handling (optional, but professional)
 */
$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Global logic for unauthorized access can go here
    }
    return Promise.reject(error);
  }
);
