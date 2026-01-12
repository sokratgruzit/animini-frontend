import { $api } from '../../../shared/api';

/**
 * User Profile Structure reflecting the new Prisma schema
 */
export interface User {
  id: number;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  roles: string[];
  avatarUrl: string | null;
  bio: string | null;
  settings: Record<string, any>; // JSON field from Prisma
  balance: number;
  reputation: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response structure from Auth endpoints
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Checks current session by calling the refresh endpoint.
 */
export const checkAuthRequest = async (): Promise<AuthResponse> => {
  const response = await $api.post<AuthResponse>('/auth/refresh');
  return response.data;
};

/**
 * FIXED: Changed to POST.
 * Terminates session and notifies the event system.
 */
export const logoutRequest = async () => {
  const response = await $api.post('/auth/logout');
  return response.data;
};

/**
 * Activates account via token.
 */
export const activateRequest = async (token: string) => {
  const response = await $api.post('/auth/verify-email', { token });
  return response.data;
};

/**
 * FIXED: Changed to POST.
 * Triggers a new verification email.
 */
export const resendEmailRequest = async () => {
  const response = await $api.post('/auth/resend-email');
  return response.data;
};

/**
 * NEW: Dynamic profile update.
 * Allows updating name, avatar, bio, and settings JSON.
 */
export const updateProfileRequest = async (
  data: Partial<User>
): Promise<User> => {
  const response = await $api.patch<User>('/auth/profile', data);
  return response.data;
};

/**
 * NEW: Change user password.
 */
export const changePasswordRequest = async (
  oldPassword: string,
  newPassword: string
) => {
  const response = await $api.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};
