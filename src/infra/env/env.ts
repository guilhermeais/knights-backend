import { z } from 'zod';
import 'dotenv/config';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  MONGO_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
