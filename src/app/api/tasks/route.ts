import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const createTaskSchema = z.object({
  title: z.string().trim().min(1),
  details: z.string().trim().optional().default('')
});

const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1),
  details: z.string().trim().optional().default('')
});

const deleteTaskSchema = z.object({
  id: z.string().uuid()
});

async function getAuthenticatedUserId() {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return { supabase, userId: null };
  }

  return { supabase, userId: auth.user.id };
}

export async function GET() {
  const { supabase, userId } = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('todo_tasks')
    .select('id,title,details,created_at,updated_at,created_by,updated_by')
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ tasks: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase, userId } = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = createTaskSchema.parse(await request.json());

  const { data, error } = await supabase
    .from('todo_tasks')
    .insert({ ...payload, created_by: userId, updated_by: userId })
    .select('id,title,details,created_at,updated_at,created_by,updated_by')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ task: data });
}

export async function PATCH(request: Request) {
  const { supabase, userId } = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = updateTaskSchema.parse(await request.json());

  const { data, error } = await supabase
    .from('todo_tasks')
    .update({ title: payload.title, details: payload.details, updated_by: userId })
    .eq('id', payload.id)
    .select('id,title,details,created_at,updated_at,created_by,updated_by')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ task: data });
}

export async function DELETE(request: Request) {
  const { supabase, userId } = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = deleteTaskSchema.parse(await request.json());

  const { error } = await supabase.from('todo_tasks').delete().eq('id', payload.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
