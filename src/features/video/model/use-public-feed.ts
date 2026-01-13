import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getPublicFeed, type PublicSeriesSnapshot } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';

interface UsePublicFeedProps {
  tags?: string[];
  type?: 'hot' | 'new' | 'completed' | 'most_funded';
  limit?: number;
}

export const usePublicFeed = ({
  tags = [],
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
    queryKey: [...VIDEO_KEYS.details('public-feed'), { tags, type, limit }],

    /**
     * Explicitly typing context to help TS resolve pageParam as string | undefined
     */
    queryFn: ({ pageParam }: QueryFunctionContext<any, string | undefined>) =>
      getPublicFeed({
        cursor: pageParam,
        limit,
        tags,
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
