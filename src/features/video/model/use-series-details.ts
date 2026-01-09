import { useState, useEffect, useCallback } from 'react';
import { getSeriesDetails, type SeriesItem } from '../api';

/**
 * Hook to manage a single series state and its episodes
 */
export const useSeriesDetails = (seriesId: string) => {
  const [series, setSeries] = useState<SeriesItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const fetchDetails = useCallback(async () => {
    if (!seriesId) return;

    setIsLoading(true);
    try {
      const response = await getSeriesDetails(seriesId);
      if (response.success) {
        setSeries(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load series details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [seriesId]);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails, version]);

  return {
    series,
    isLoading,
    error,
    refresh,
  };
};
