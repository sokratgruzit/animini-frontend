import { $api } from '../../../shared/api';
import { type CreateVideoInput } from '../model/video-schema';

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  status: string;
  votesRequired: number;
  collectedFunds: number;
  createdAt: string;
}

interface GetAuthorVideosResponse {
  success: boolean;
  items: VideoItem[];
}

/**
 * Fetch all videos belonging to the current author
 */
export const getAuthorVideos = async (): Promise<GetAuthorVideosResponse> => {
  const { data } = await $api.get<GetAuthorVideosResponse>('/videos/my');
  return data;
};

/**
 * AUTHOR action: Create a new video series
 * @param payload - Validated video data from the form
 */
export const createVideo = async (payload: CreateVideoInput) => {
  const { data } = await $api.post('/videos', payload);
  return data;
};
