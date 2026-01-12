import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  depositFundsRequest,
  checkPaymentStatusRequest,
} from '../api/wallet-api';
import { QUERY_KEYS } from '../../../shared/config/query-keys';

/**
 * Initiates a deposit and handles redirection to the payment gateway.
 */
export const useDepositFunds = () => {
  return useMutation({
    mutationFn: depositFundsRequest,
    onSuccess: (data) => {
      if (data.confirmationUrl && data.transactionId) {
        sessionStorage.setItem('pendingTransactionId', data.transactionId);
        window.location.href = data.confirmationUrl;
      }
    },
  });
};

/**
 * Verifies payment status and refreshes wallet data upon success.
 */
export const useCheckPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkPaymentStatusRequest,
    onSuccess: async (data) => {
      /**
       * We only care about the response data to trigger cache invalidation.
       * If status is final, we refresh balance and transaction history.
       */
      const isReady =
        data.status === 'completed' || data.status === 'succeeded';

      if (isReady) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.wallet.balance(),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.wallet.transactions(),
          }),
        ]);

        sessionStorage.removeItem('pendingTransactionId');
      }
    },
    onError: () => {
      sessionStorage.removeItem('pendingTransactionId');
    },
  });
};
