import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  API_HOST: z.string().optional().default('0.0.0.0'),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
