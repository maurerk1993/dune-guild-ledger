import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { assertAdmin } from '@/lib/authz';

const updateRoleSchema = z.object({
  userId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  role: z.enum(['member', 'admin'])
}).superRefine((value, ctx) => {
  if (!value.userId && !value.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either userId or email must be provided.'
    });
  }
});

export async function PATCH(request: Request) {
  await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const { userId, email, role } = updateRoleSchema.parse(await request.json());

  let targetId = userId;

  if (!targetId && email) {
    const normalizedEmail = email.trim().toLowerCase();
    const { data: targetByEmail } = await supabase.from('profiles').select('id').ilike('email', normalizedEmail).single();
    if (!targetByEmail) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    targetId = targetByEmail.id;
  }

  if (!targetId) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { error } = await supabase.from('profiles').update({ role }).eq('id', targetId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
