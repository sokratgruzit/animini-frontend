import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoWalletOutline } from 'react-icons/io5';
import { Input, Button, ErrorMessage, Spinner } from '../../../shared/ui';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { depositFunds, setError } from '../../../entities/wallet/model/slice';
import { depositSchema, type DepositSchema } from '../model';

export const DepositWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.wallet);

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
    dispatch(setError(null));

    dispatch(depositFunds(data.amount))
      .unwrap()
      .then(() => {
        /**
         * Reset local form state.
         * Redirection logic is handled within the thunk.
         */
        reset();
      })
      .catch(() => {
        // Error state is managed by Redux slice
      });
  };

  /**
   * Determine if the UI should show redirection state
   */
  const isRedirecting = isLoading && !error;

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

        {isLoading ? (
          <div className="px-4 py-3 bg-glass-bg border border-glass-border rounded-xl outline-none transition-all duration-300 w-full">
            <Spinner message="Processing..." />
          </div>
        ) : (
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
        )}

        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
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
