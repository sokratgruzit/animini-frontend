import axios from 'axios';

/**
 * Pre-configured axios instance for backend communication
 */
export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Required for cookies/sessions
});

/**
 * Request interceptor to attach the access token from localStorage
 */
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor to handle 401 Unauthorized errors
 */
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    /**
     * If the error is 401 and we haven't tried to refresh yet
     */
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        /**
         * Use a fresh axios instance to call /refresh.
         * This prevents infinite loops and bypasses $api interceptors.
         */
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/refresh`,
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        /**
         * Save new token and retry the original request with new headers
         */
        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return $api.request(originalRequest);
      } catch (refreshError) {
        /**
         * If refresh fails, the session is dead.
         * Clean up and notify the application.
         */
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new CustomEvent('app:unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
