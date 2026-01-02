import { z } from 'zod';

/**
 * Validation schema for the Registration form
 */
export const registerSchema = z
  .object({
    email: z.email('Invalid email address'),
    name: z.string('Name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Error will be attached to confirmPassword field
  });

/**
 * TypeScript type inferred from the schema
 */
export type RegisterSchema = z.infer<typeof registerSchema>;
