import { z } from 'zod';
import 'dotenv/config';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  MONGO_URL: z.string().default('mongodb://localhost:27017'),
});

export type Env = z.infer<typeof envSchema>;
