import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSeries } from '../api';
import { VIDEO_KEYS } from '../../../shared/config/query-keys';

/**
 * Hook to handle the creation of a new series (project).
 * Integrated with TanStack Query for state management and cache invalidation.
 */
export const useCreateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * mutationFn calls the API method provided in the features/video/api layer.
     */
    mutationFn: createSeries,

    onSuccess: () => {
      /**
       * After successful creation, we invalidate the 'workspace' query.
       * This triggers useAuthorWorkspace to re-fetch the latest list of projects.
       */
      queryClient.invalidateQueries({
        queryKey: VIDEO_KEYS.workspace(),
      });
    },

    onError: (error: any) => {
      /**
       * Error handling can be localized in the component,
       * but we log it here for debugging purposes.
       */
      console.error(
        'Series creation failed:',
        error.response?.data?.message || error.message
      );
    },
  });
};
