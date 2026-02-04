import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteForVideo } from '../api';
import { QUERY_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook for handling paid voting for a video episode.
 */
export const useVoteVideo = (seriesId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteForVideo,
    onSuccess: () => {
      // 1. Invalidate specific series details to update progress bar
      if (seriesId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.videos.details(seriesId),
        });
      }

      // 2. Invalidate discover feed (list view)
      queryClient.invalidateQueries({
        queryKey: ['videos', 'details', 'public-feed'],
      });

      // 3. Invalidate balance to reflect deduction
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.wallet.balance(),
      });
    },
  });
};
