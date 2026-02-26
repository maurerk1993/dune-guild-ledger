import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_MEMBER_LEDGER_SCOPE: z.enum(['all', 'self']).default('all'),
  NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAILS: z.string().optional()
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_MEMBER_LEDGER_SCOPE: process.env.NEXT_PUBLIC_MEMBER_LEDGER_SCOPE,
  NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAILS: process.env.NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAILS
});
