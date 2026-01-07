import { useState, useEffect } from 'react';
import { getAuthorVideos, type VideoItem } from '../api';

export const useAuthorVideos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const data = await getAuthorVideos();
      if (data.success) {
        setVideos(data.items);
      } else {
        setError('Failed to fetch videos');
      }
    } catch (err) {
      setError('An error occurred while loading videos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    isLoading,
    error,
    refresh: fetchVideos,
  };
};
