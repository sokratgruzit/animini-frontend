import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTransactionsRequest } from '../api/wallet-api';
import { QUERY_KEYS } from '../../../shared/config/query-keys';

const LIMIT = 20;

/**
 * Hook for paginated transaction history.
 * Replaces Redux-based pagination logic.
 */
export const useTransactions = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.wallet.transactions(),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchTransactionsRequest(pageParam, LIMIT);
      return response;
    },
    /**
     * Determine if there is more data to load.
     * We compare total loaded items with total available.
     */
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (acc, page) => acc + page.items.length,
        0
      );

      if (totalLoaded < lastPage.total) {
        return allPages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Flat array of transactions for the UI
  const transactions = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

  return {
    transactions,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refresh: refetch,
    error: error instanceof Error ? error.message : null,
  };
};
