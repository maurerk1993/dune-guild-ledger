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
  const { userId, role } = updateRoleSchema.parse(await request.json());

  if (userId === currentProfile.id && role !== 'admin') {
    return NextResponse.json({ error: 'You cannot demote your own account.' }, { status: 400 });
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
