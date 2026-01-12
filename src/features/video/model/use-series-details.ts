import { useQuery } from '@tanstack/react-query';
import { getSeriesDetails } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook to manage a single series state and its episodes.
 * Uses centralized keys for precise cache invalidation.
 */
export const useSeriesDetails = (seriesId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    /**
     * The key is reactive: query will automatically re-run
     * if seriesId changes.
     */
    queryKey: VIDEO_KEYS.details(seriesId),
    queryFn: async () => {
      if (!seriesId) return null;

      const response = await getSeriesDetails(seriesId);

      if (!response.success) {
        throw new Error('Failed to load series details');
      }

      return response.data;
    },
    /**
     * Prevents fetching if seriesId is missing
     */
    enabled: !!seriesId,
    staleTime: 0,
  });

  return {
    series: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
};
