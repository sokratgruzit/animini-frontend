import { z } from 'zod';
import { GENRES } from '../../../shared/config/genres';

const GENRE_VALUES = Object.keys(GENRES) as [string, ...string[]];

export const createSeriesSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(),
  coverUrl: z.url('Invalid cover image URL').optional().or(z.literal('')),
  genre: z.enum(GENRE_VALUES).superRefine((val, ctx) => {
    if (!GENRE_VALUES.includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a valid genre from the protocol',
      });
    }
  }),
});

export const createVideoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  url: z.url('Invalid video URL'),
  seriesId: z.uuid('Series selection is required'),
});

export const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string(),
  seriesId: z.uuid('Invalid series ID reference'),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
