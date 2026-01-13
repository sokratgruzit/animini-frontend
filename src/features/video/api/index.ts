import axios from 'axios';
import { $api } from '../../../shared/api';
import {
  type CreateVideoInput,
  type CreateSeriesInput,
  type UploadRequestInput,
} from '../model';

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  status: string;
  seriesId: string;
  votesRequired: number;
  collectedFunds: number;
  isReleased: boolean;
  createdAt: string;
  _count?: {
    votes: number;
    reviews: number;
  };
}

export interface SeriesItem {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  totalEarnings: number;
  videos: VideoItem[];
  createdAt: string;
}

/**
 * AI2UI Optimized Snapshot Interface
 * This is what the public discover feed returns.
 */
export interface PublicSeriesSnapshot {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  tags: string[];
  totalEarnings: number;
  author: {
    name: string;
    avatar: string | null;
  };
  activeEpisode: {
    id: string;
    title: string;
    progress: number;
    status: string;
  } | null;
  stats: {
    totalEpisodes: number;
    releasedCount: number;
  };
}

interface GetPublicFeedResponse {
  success: boolean;
  items: PublicSeriesSnapshot[];
  nextCursor: string | null;
}

interface GetAuthorWorkspaceResponse {
  success: boolean;
  items: SeriesItem[];
}

/**
 * PUBLIC: Fetch the discover feed with pagination and filters
 */
export const getPublicFeed = async (params: {
  cursor?: string;
  limit?: number;
  tags?: string[];
  type?: 'hot' | 'new' | 'completed' | 'most_funded';
}): Promise<GetPublicFeedResponse> => {
  const { data } = await $api.get<GetPublicFeedResponse>('/videos/discover', {
    params: {
      ...params,
      // Convert array to comma-separated string for the backend controller
      tags: params.tags?.join(','),
    },
  });
  return data;
};

/**
 * Fetch full author workspace (Series with nested Videos)
 */
export const getAuthorWorkspace =
  async (): Promise<GetAuthorWorkspaceResponse> => {
    const { data } =
      await $api.get<GetAuthorWorkspaceResponse>('/videos/workspace');
    return data;
  };

/**
 * 1. Request a signed upload URL from backend
 */
export const getUploadUrl = async (payload: UploadRequestInput) => {
  const { data } = await $api.post('/videos/upload-url', payload);
  return data;
};

/**
 * 2. Upload file directly to Supabase storage
 */
export const uploadFileToStorage = async (
  url: string,
  file: File,
  onProgress?: (percent: number) => void
) => {
  return axios.put(url, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      if (onProgress) onProgress(percent);
    },
  });
};

/**
 * 3. Create a new Series container
 */
export const createSeries = async (payload: CreateSeriesInput) => {
  const { data } = await $api.post('/videos/series', payload);
  return data;
};

/**
 * 4. Finalize video (episode) creation in database
 */
export const createVideo = async (payload: CreateVideoInput) => {
  const { data } = await $api.post('/videos', payload);
  return data;
};

/**
 * Fetch a single series with its episodes by ID
 */
export const getSeriesDetails = async (
  id: string
): Promise<{ success: boolean; data: SeriesItem }> => {
  const { data } = await $api.get(`/videos/series/${id}`);
  return data;
};
