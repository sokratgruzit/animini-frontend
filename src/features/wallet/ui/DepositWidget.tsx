import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoWalletOutline } from 'react-icons/io5';
import { Input, Button, ErrorMessage } from '../../../shared/ui';
import { useDepositFunds } from '../../../entities/wallet/model/use-wallet-mutations';
import { depositSchema, type DepositSchema } from '../model';

export const DepositWidget = () => {
  const { mutate: deposit, isPending: isLoading, error } = useDepositFunds();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
    mode: 'onChange',
    defaultValues: { amount: 100 },
  });

  const onSubmit = (data: DepositSchema) => {
    // setError(null) is not needed; React Query handles error state automatically

    // Call the mutation function instead of dispatching a thunk
    deposit(data.amount, {
      onSuccess: () => {
        /**
         * Reset local form state.
         * Redirection logic is handled within the mutation hook.
         */
        reset();
      },
      // onError handled by global error boundary or useMutation options
    });
  };

  /**
   * Determine if the UI should show redirection state
   * Error state is managed automatically by the useMutation hook
   */
  const isRedirecting = isLoading && !error;
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 h-full pointer-events-auto"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-6">
          <IoWalletOutline size={28} className="text-brand-primary" />
          <h3 className="text-xl font-bold text-surface-100">Deposit Funds</h3>
        </div>

        <p className="text-surface-200 mb-6">
          Enter the amount you wish to deposit into your account balance.
        </p>

        <Input
          {...register('amount', { valueAsNumber: true })}
          label="Amount in Coins"
          placeholder="e.g., 500"
          error={errors.amount?.message}
          disabled={isLoading}
          type="number"
          step={10}
          min={10}
          max={10000}
        />

        {errorMessage && (
          <div className="mt-4">
            <ErrorMessage message={errorMessage} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-glass-border">
        <Button
          type="submit"
          isLoading={isLoading}
          className="shadow-brand-glow bg-brand-primary"
        >
          {isRedirecting ? 'Redirecting to Payment...' : 'Confirm Deposit'}
        </Button>
      </div>
    </form>
  );
};
