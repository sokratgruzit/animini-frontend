import { $api } from '../../../shared/api';

export type ReviewType = 'POSITIVE' | 'NEGATIVE';

export interface ReviewItem {
  id: string;
  content: string;
  type: ReviewType;
  votesRequired: number;
  currentVotes: number;
  cancelVotes: number;
  isExecuted: boolean;
  impactAmount: number;
  criticId: number;
  videoId: string;
  critic: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface PostReviewPayload {
  videoId: string;
  content: string;
  type: ReviewType;
}

interface VoteReviewPayload {
  reviewId: string;
  isCancel?: boolean;
}

/**
 * Fetch all reviews for a specific video
 */
export const getVideoReviews = async (
  videoId: string
): Promise<ReviewItem[]> => {
  const { data } = await $api.get(`/interactions/video/${videoId}/reviews`);
  return data;
};

/**
 * Post a new expert review (Requires CRITIC role)
 * Backend will deduct REVIEW_CREATION_FEE from user balance
 */
export const postReview = async (
  payload: PostReviewPayload
): Promise<{ success: boolean; review: ReviewItem }> => {
  const { data } = await $api.post('/interactions/review', payload);
  return data;
};

/**
 * Vote for or against a review
 * isCancel: true triggers the cancellation logic
 */
export const voteForReview = async (
  payload: VoteReviewPayload
): Promise<any> => {
  const { data } = await $api.post('/interactions/vote-review', payload);
  return data;
};
