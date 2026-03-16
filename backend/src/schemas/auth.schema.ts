import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
