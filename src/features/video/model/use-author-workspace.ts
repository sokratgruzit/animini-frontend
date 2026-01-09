import { useState, useEffect, useCallback } from 'react';
import { getAuthorWorkspace, type SeriesItem } from '../api';

/**
 * Hook to manage author's hierarchical content: Series -> Videos
 */
export const useAuthorWorkspace = () => {
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const fetchWorkspace = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAuthorWorkspace();
      if (data.success) {
        setSeries(data.items);
        setError(null);
      }
    } catch (err) {
      setError('An error occurred while loading your workspace');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Triggers re-fetch by bumping the version counter
   */
  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace, version]);

  return {
    series, // Now returning series tree instead of flat videos
    isLoading,
    error,
    refresh,
  };
};
