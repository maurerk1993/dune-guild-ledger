import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

const schema = z.object({
  display_name: z.string().min(1),
  handle: z.string().nullable().optional(),
  rank: z.string().nullable().optional(),
  join_date: z.string().optional(),
  notes: z.string().optional(),
  user_id: z.string().uuid().nullable().optional()
});

export async function POST(request: Request) {
  await assertAdmin();
  const payload = schema.parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('roster_members').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  await assertAdmin();
  const { id, ...rest } = z.object({ id: z.string().uuid() }).merge(schema.partial()).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('roster_members').update(rest).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  await assertAdmin();
  const { id } = z.object({ id: z.string().uuid() }).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('roster_members').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
