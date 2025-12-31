import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, ErrorMessage } from '../../../../shared/ui';
import { loginSchema, type LoginSchema, useLogin } from '../../model';

interface LoginFormProps {
  onSuccess?: () => void;
  onFlip?: () => void; // Switch to Registration form
}

/**
 * Login Form Component.
 * Handles user authentication via email and password.
 */
export const LoginForm = ({ onSuccess, onFlip }: LoginFormProps) => {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginSchema) => {
    mutate(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <h2 className="text-white text-2xl font-bold mb-2 text-center">
        Welcome Back
      </h2>

      <Input
        {...register('email')}
        label="Email Address"
        placeholder="example@mail.com"
        error={errors.email?.message}
        disabled={isPending}
      />

      <Input
        {...register('password')}
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isPending}
      />

      {error && (
        <ErrorMessage
          message={
            (error as any).response?.data?.message ||
            'Invalid email or password'
          }
        />
      )}

      <Button type="submit" isLoading={isPending} className="mt-2">
        Log In
      </Button>

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={onFlip}
          className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};
