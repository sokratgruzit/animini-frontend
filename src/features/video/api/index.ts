import axios from 'axios';
import { $api } from '../../../shared/api';
import { type GenreType } from '../../../shared/config/genres';
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
  genre: GenreType;
  totalEarnings: number;
  videos: VideoItem[];
  createdAt: string;
}

export interface PublicSeriesSnapshot {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  genre: GenreType;
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
 * PUBLIC: Fetch the discover feed
 */
export const getPublicFeed = async (params: {
  cursor?: string;
  limit?: number;
  genre?: GenreType;
  type?: 'hot' | 'new' | 'completed' | 'most_funded';
}): Promise<GetPublicFeedResponse> => {
  const { data } = await $api.get<GetPublicFeedResponse>('/videos/discover', {
    params,
  });
  return data;
};

/**
 * Fetch full author workspace
 */
export const getAuthorWorkspace =
  async (): Promise<GetAuthorWorkspaceResponse> => {
    const { data } =
      await $api.get<GetAuthorWorkspaceResponse>('/videos/workspace');
    return data;
  };

/**
 * 1. Request a signed upload URL
 */
export const getUploadUrl = async (payload: UploadRequestInput) => {
  const { data } = await $api.post('/videos/upload-url', payload);
  return data;
};

/**
 * 2. Upload file directly to storage
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
 * 4. Finalize video creation
 */
export const createVideo = async (payload: CreateVideoInput) => {
  const { data } = await $api.post('/videos', payload);
  return data;
};

/**
 * Fetch a single series details
 */
export const getSeriesDetails = async (
  id: string
): Promise<{ success: boolean; data: SeriesItem }> => {
  const { data } = await $api.get(`/videos/series/${id}`);
  return data;
};

/**
 * INTERACTION: Cast a vote for a video (Paid)
 */
export const voteForVideo = async (payload: {
  videoId: string;
  amount: number;
}) => {
  const { data } = await $api.post('/interactions/vote-video', payload);
  return data;
};

/**
 * INTERACTION: Post a critic review
 */
export const postReview = async (payload: {
  videoId: string;
  content: string;
  type: 'POSITIVE' | 'NEGATIVE';
}) => {
  const { data } = await $api.post('/interactions/review', payload);
  return data;
};

/**
 * INTERACTION: Vote for a review (Paid)
 */
export const voteForReview = async (payload: { reviewId: string }) => {
  const { data } = await $api.post('/interactions/vote-review', payload);
  return data;
};
