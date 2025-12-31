import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, ErrorMessage } from '../../../../shared/ui';
import { registerSchema, type RegisterSchema, useRegister } from '../../model';

interface RegisterFormProps {
  onSuccess?: () => void;
  onFlip?: () => void; // Function to switch to Login form
}

/**
 * Registration Form Component.
 * Integrates validation, API mutation, and Shared UI.
 */
export const RegisterForm = ({ onSuccess, onFlip }: RegisterFormProps) => {
  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterSchema) => {
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
        Create Account
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

      <Input
        {...register('confirmPassword')}
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isPending}
      />

      {error && (
        <ErrorMessage
          message={
            (error as any).response?.data?.message || 'Registration failed'
          }
        />
      )}

      <Button type="submit" isLoading={isPending} className="mt-2">
        Sign Up
      </Button>

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={onFlip}
          className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
        >
          Already have an account? Log in
        </button>
      </div>
    </form>
  );
};
