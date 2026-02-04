import { z } from 'zod';

/**
 * Review Type must match the backend Enum
 */
export const ReviewTypeEnum = z.enum(['POSITIVE', 'NEGATIVE']);

/**
 * Validation schema for creating a new expert review.
 * content: min 10 chars to ensure "expert" quality.
 */
export const createReviewSchema = z.object({
  videoId: z.uuid('Invalid video reference'),
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(2000, 'Review is too long'),
  type: ReviewTypeEnum,
});

/**
 * Validation schema for voting (Support or Cancel)
 */
export const voteReviewSchema = z.object({
  reviewId: z.uuid('Invalid review reference'),
  isCancel: z.boolean().optional().default(false),
});

/**
 * Types inferred from schemas for use in forms and hooks
 */
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type VoteReviewInput = z.infer<typeof voteReviewSchema>;
