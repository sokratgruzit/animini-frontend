import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteForReview } from '../api';
import { QUERY_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook to vote for or against a review
 */
export const useVoteReview = (videoId: string, seriesId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteForReview,
    onSuccess: () => {
      // 1. Update the reviews list
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'reviews', videoId],
      });

      // 2. Update series/video progress (in case review was executed and funds stolen)
      if (seriesId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.videos.details(seriesId),
        });
      }

      // 3. Update user balance (deduct 1 coin)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.balance() });
    },
  });
};
