import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

const schema = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0)
});

export async function POST(request: Request) {
  await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const payload = schema.parse(await request.json());
  const { error } = await supabase.from('contribution_actions').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  await assertAdmin();
  const { id, ...rest } = z.object({ id: z.string().uuid() }).merge(schema.partial()).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('contribution_actions').update(rest).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  await assertAdmin();
  const { id } = z.object({ id: z.string().uuid() }).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('contribution_actions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
