import { $api } from '../../../shared/api';

/**
 * Response structure from the backend /refresh endpoint
 */
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    isAdmin: boolean;
    roles: string[];
  };
  accessToken: string;
}

/**
 * Checks current session by calling the refresh endpoint.
 * Returns both new access token and user profile data.
 */
export const checkAuthRequest = async (): Promise<AuthResponse> => {
  const response = await $api.post<AuthResponse>('/auth/refresh');
  return response.data;
};

/**
 * Notifies the server to terminate the session and clear cookies.
 */
export const logoutRequest = async () => {
  const response = await $api.get('/auth/logout');
  return response.data;
};

/**
 * Sends the activation link to the server (to be used later).
 */
export const activateRequest = async (activationLink: string) => {
  const response = await $api.get(`/auth/activate/${activationLink}`);
  return response.data;
};
