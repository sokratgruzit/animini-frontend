import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { registerRequest } from '../api/register-request';
import { setAuth } from '../../../entities/user';
import type { RegisterSchema } from './register-schema';

/**
 * Custom hook for handling registration logic.
 * Connects API request with Redux state management.
 */
export const useRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    // We omit confirmPassword from the data sent to the server
    mutationFn: (data: RegisterSchema) => {
      const { confirmPassword, ...registerDto } = data;
      return registerRequest(registerDto);
    },

    // On success, we update the Redux store with received user data
    onSuccess: (userData) => {
      dispatch(setAuth(userData));
      console.log('Registration successful:', userData);
    },

    // Global error handling for this mutation
    onError: (error: any) => {
      console.error(
        'Registration failed:',
        error.response?.data?.message || error.message
      );
    },
  });
};
