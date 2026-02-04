import { useQuery } from '@tanstack/react-query';
import { getVideoReviews } from '../api';

/**
 * Hook to fetch all reviews for a specific video
 */
export const useReviews = (videoId: string) => {
  return useQuery({
    queryKey: ['interactions', 'reviews', videoId],
    queryFn: () => getVideoReviews(videoId),
    enabled: !!videoId,
    staleTime: 0,
  });
};
