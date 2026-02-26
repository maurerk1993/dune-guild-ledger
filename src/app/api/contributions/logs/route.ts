import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action_id } = z.object({ action_id: z.string().uuid() }).parse(await request.json());

  const [{ data: profile }, { data: action }] = await Promise.all([
    supabase.from('profiles').select('display_name,email').eq('id', auth.user.id).single<{ display_name: string | null; email: string }>(),
    supabase.from('contribution_actions').select('label').eq('id', action_id).single<{ label: string }>()
  ]);

  const actorName = profile?.display_name?.trim() || profile?.email || 'unknown';
  const actionLabel = action?.label ?? 'Unknown contribution';

  const { error } = await supabase.from('contribution_logs').insert({
    action_id,
    user_id: auth.user.id,
    actor_name: actorName,
    action_label: actionLabel
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  await assertAdmin();
  const { id } = z.object({ id: z.string().uuid() }).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('contribution_logs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
