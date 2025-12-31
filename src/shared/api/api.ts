import axios from 'axios';

/**
 * Pre-configured axios instance for backend communication
 */
export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Required for cookies/sessions
});

/**
 * Interceptor for global error handling
 */
$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      /**
       * Dispatch a global event when unauthorized.
       * The App layer will listen to this and trigger Redux logout.
       */
      window.dispatchEvent(new CustomEvent('app:unauthorized'));
    }
    return Promise.reject(error);
  }
);
