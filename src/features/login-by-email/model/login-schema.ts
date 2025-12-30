import { z } from "zod";

/**
 * Validation schema for the Login form
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * TypeScript type inferred from the schema
 */
export type LoginSchema = z.infer<typeof loginSchema>;
