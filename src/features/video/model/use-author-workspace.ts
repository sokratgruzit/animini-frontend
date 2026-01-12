import { useQuery } from '@tanstack/react-query';
import { getAuthorWorkspace } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook to manage author's hierarchical content (Series -> Videos).
 * Integrated with TanStack Query and uses centralized query keys.
 */
export const useAuthorWorkspace = () => {
  const { data, isLoading, error, refetch } = useQuery({
    /**
     * Using consistent key from shared config to allow
     * external invalidation via SSE subscriber.
     */
    queryKey: VIDEO_KEYS.workspace(),
    queryFn: async () => {
      const response = await getAuthorWorkspace();

      if (!response.success) {
        throw new Error('Failed to fetch workspace data');
      }

      return response.items;
    },
    /**
     * StaleTime set to 0 ensures we always validate data
     * when the subscriber triggers an invalidation.
     */
    staleTime: 0,
  });

  return {
    /**
     * Data integrity: fallback to empty array for stable rendering
     */
    series: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    /**
     * Exposed refetch method for manual UI triggers
     */
    refresh: refetch,
  };
};
