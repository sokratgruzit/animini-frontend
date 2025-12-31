import { $api } from '../../../shared/api';

/**
 * Checks current session on the backend.
 * Returns user data if session is valid.
 */
export const checkAuthRequest = async () => {
  const response = await $api.get('/refresh'); // Или /check, зависит от твоего бэкенда
  return response.data;
};

/**
 * Notifies the server to terminate the current session.
 */
export const logoutRequest = async () => {
  const response = await $api.post('/logout');
  return response.data;
};

/**
 * Sends the activation link to the server to verify the account.
 */
export const activateRequest = async (activationLink: string) => {
  const response = await $api.get(`/activate/${activationLink}`);
  return response.data;
};
