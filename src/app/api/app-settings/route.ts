import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

const schema = z.object({
  message_of_the_day: z.string().min(1)
});

export async function PATCH(request: Request) {
  await assertAdmin();
  const { message_of_the_day } = schema.parse(await request.json());
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('app_settings')
    .update({ message_of_the_day })
    .eq('id', 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
