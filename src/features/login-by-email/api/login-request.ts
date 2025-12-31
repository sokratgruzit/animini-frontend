import { $api } from '../../../shared/api';
import { type LoginSchema } from '../model';

/**
 * Sends login credentials to the server
 */
export const loginRequest = async (data: LoginSchema) => {
  // Assuming the endpoint is /login according to standard practices
  const response = await $api.post('/login', data);
  return response.data;
};
