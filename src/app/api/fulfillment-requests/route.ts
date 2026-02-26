import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = z.object({ ledger_entry_id: z.string().uuid(), notes: z.string().optional() }).parse(await request.json());
  const { error } = await supabase.from('fulfillment_requests').insert({ ...payload, requester_user_id: auth.user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const { id, approve } = z.object({ id: z.string().uuid(), approve: z.boolean() }).parse(await request.json());

  const { error } = await supabase
    .from('fulfillment_requests')
    .update({ status: approve ? 'approved' : 'rejected' })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (approve) {
    const { data } = await supabase.from('fulfillment_requests').select('ledger_entry_id').eq('id', id).single();
    if (data?.ledger_entry_id) await supabase.from('ledger_entries').update({ status: 'fulfilled' }).eq('id', data.ledger_entry_id);
  }

  return NextResponse.json({ ok: true });
}
