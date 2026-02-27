import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['member', 'admin'])
});

export async function PATCH(request: Request) {
  const currentProfile = await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const { email, role } = z.object({ email: z.string().email(), role: z.enum(['member', 'admin']) }).parse(await request.json());
  const normalizedEmail = email.trim().toLowerCase();

  const { data: target } = await supabase.from('profiles').select('id').ilike('email', normalizedEmail).single();
  if (!target) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
