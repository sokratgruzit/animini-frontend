import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReview } from '../api';
import { QUERY_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook to post a new expert review
 */
export const usePostReview = (seriesId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      // Refresh reviews list
      queryClient.invalidateQueries({ queryKey: ['interactions', 'reviews'] });
      // Refresh balance after fee deduction
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.balance() });
      // Refresh series details to see any immediate impact
      if (seriesId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.videos.details(seriesId),
        });
      }
    },
  });
};
