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

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        /**
         * If the original failed request was the checkAuth call (/auth/refresh),
         * we return the data we just received instead of re-executing the call.
         */
        if (originalRequest.url?.includes('/auth/refresh')) {
          return { ...response, data: response.data };
        }

        return $api.request(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new CustomEvent('app:unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
