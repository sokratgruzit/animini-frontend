import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../api/login-request';
import { setAuth } from '../../../entities/user';
import { type LoginSchema } from './login-schema';

/**
 * Custom hook for handling login logic.
 * Updates Redux state on successful authentication.
 */
export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: LoginSchema) => loginRequest(data),

    onSuccess: (userData) => {
      // Dispatch user data to global Redux store
      dispatch(setAuth(userData));
      console.log('Login successful');
    },

    onError: (error: any) => {
      console.error(
        'Login error:',
        error.response?.data?.message || error.message
      );
    },
  });
};
