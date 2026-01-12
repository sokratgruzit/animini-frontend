import { useQuery } from '@tanstack/react-query';
import { fetchWalletDataRequest } from '../api/wallet-api';
import { QUERY_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook to manage wallet state (balance and reputation).
 * Replaces the Redux-based getWalletData thunk.
 */
export const useWallet = () => {
  const { data, isLoading, error, refetch } = useQuery({
    /**
     * Unique key for wallet balance, defined in our shared config.
     */
    queryKey: QUERY_KEYS.wallet.balance(),
    queryFn: async () => {
      const response = await fetchWalletDataRequest();
      /**
       * The API returns { balance: number, reputation: number }.
       * React Query handles the state, so we don't need manual Redux dispatches.
       */
      return response;
    },
    /**
     * Data is considered fresh for 5 minutes.
     * Invalidation via SSE will trigger an immediate update regardless of this timer.
     */
    staleTime: 5 * 60 * 1000,
  });

  return {
    balance: data?.balance ?? 0,
    reputation: data?.reputation ?? 0,
    isLoading,
    error: error instanceof Error ? error.message : null,
    /**
     * Exposed for manual refresh triggers from the UI.
     */
    refresh: refetch,
  };
};
