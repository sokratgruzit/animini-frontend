import { z } from 'zod';

export const depositSchema = z.object({
  amount: z
    .number()
    .min(10, 'Minimum deposit is 10 coins')
    .max(10000, 'Maximum deposit is 10,000 coins'),
});

export type DepositSchema = z.infer<typeof depositSchema>;
