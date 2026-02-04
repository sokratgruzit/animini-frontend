import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getPublicFeed, type PublicSeriesSnapshot } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';
import { type GenreType } from '../../../shared/config/genres';

interface UsePublicFeedProps {
  genre?: GenreType; // Changed: replaced tags with single genre
  type?: 'hot' | 'new' | 'completed' | 'most_funded';
  limit?: number;
}

export const usePublicFeed = ({
  genre, // Default to undefined to show all genres
  type = 'new',
  limit = 10,
}: UsePublicFeedProps = {}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    /**
     * Updated queryKey: using genre instead of tags for cache invalidation
     */
    queryKey: [...VIDEO_KEYS.details('public-feed'), { genre, type, limit }],

    /**
     * Explicitly typing context to help TS resolve pageParam as string | undefined
     */
    queryFn: ({ pageParam }: QueryFunctionContext<any, string | undefined>) =>
      getPublicFeed({
        cursor: pageParam,
        limit,
        genre,
        type,
      }),

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    staleTime: 1000 * 60,
  });

  const items: PublicSeriesSnapshot[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  return {
    items,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refresh: refetch,
  };
};
