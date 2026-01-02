import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { registerRequest } from '../api/register-request';
import { setAuth } from '../../../entities/user';
import type { RegisterSchema } from './register-schema';

/**
 * Custom hook for handling registration logic.
 * Updates localStorage and Redux store on success.
 */
export const useRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: RegisterSchema) => {
      const { confirmPassword, ...registerDto } = data;
      return registerRequest(registerDto);
    },

    onSuccess: (data) => {
      /**
       * data contains { user, accessToken, message, success }
       * Store the access token for subsequent API calls
       */
      localStorage.setItem('accessToken', data.accessToken);

      /**
       * Update global Redux state with user profile data
       */
      dispatch(setAuth(data.user));

      console.log('Registration successful:', data.user.name);
    },

    onError: (error: any) => {
      console.error(
        'Registration failed:',
        error.response?.data?.message || error.message
      );
    },
  });
};
