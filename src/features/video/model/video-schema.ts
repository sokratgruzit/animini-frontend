import { z } from 'zod';

export const createSeriesSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(),
  coverUrl: z.url('Invalid cover image URL').optional().or(z.literal('')),
});

export const createVideoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  url: z.url(),
  seriesId: z.uuid('Series selection is required'),
});

/**
 * Added seriesId using your direct z.uuid() format
 */
export const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string(),
  seriesId: z.uuid('Invalid series ID reference'),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
