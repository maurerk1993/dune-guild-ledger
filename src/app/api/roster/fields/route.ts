import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

const schema = z.object({
  field_key: z.string().regex(/^[a-z0-9_]+$/),
  label: z.string().min(1),
  type: z.enum(['text', 'number', 'date']),
  is_required: z.boolean().default(false),
  order_index: z.number().int().default(0)
});

export async function POST(request: Request) {
  await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const payload = schema.parse(await request.json());
  const { error } = await supabase.from('roster_fields').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  await assertAdmin();
  const { field_key, ...rest } = z.object({ field_key: z.string() }).merge(schema.partial()).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('roster_fields').update(rest).eq('field_key', field_key);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  await assertAdmin();
  const { field_key } = z.object({ field_key: z.string() }).parse(await request.json());
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('roster_fields').delete().eq('field_key', field_key);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
