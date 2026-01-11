import { $api } from '../../../shared/api';

/**
 * Response structure from the backend /refresh and /verify-email endpoints
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
 * FIXED: Sends the activation token to the backend verify-email endpoint.
 * Matches router.post('/verify-email') logic.
 */
export const activateRequest = async (token: string) => {
  const response = await $api.post('/auth/verify-email', { token });
  return response.data;
};

/**
 * Triggers a new verification email for the authenticated user.
 */
export const resendEmailRequest = async () => {
  const response = await $api.get('/auth/resend-email');
  return response.data;
};
