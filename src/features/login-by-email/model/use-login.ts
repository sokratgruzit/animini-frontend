import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../api/login-request';
import { setAuth } from '../../../entities/user';
import { type LoginSchema } from './login-schema';

/**
 * Custom hook for handling login logic.
 * Updates tokens in localStorage and user data in Redux on success.
 */
export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: LoginSchema) => loginRequest(data),

    onSuccess: (data) => {
      /**
       * data from backend contains { user, accessToken, success, message }
       * Persist the access token for the API interceptor
       */
      localStorage.setItem('accessToken', data.accessToken);

      /**
       * Update global state with user data (id, email, name, emailVerified, etc.)
       */
      dispatch(setAuth(data.user));

      console.log('Login successful:', data.user.name);
    },

    onError: (error: any) => {
      console.error(
        'Login error:',
        error.response?.data?.message || error.message
      );
    },
  });
};
