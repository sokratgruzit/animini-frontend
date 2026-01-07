import { z } from 'zod';

/**
 * Schema for video creation validation on the frontend
 */
export const createVideoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  url: z.string().url('Invalid video URL'),
  votesRequired: z
    .number()
    .int()
    .min(1, 'At least 1 vote is required')
    .optional(),
});

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
