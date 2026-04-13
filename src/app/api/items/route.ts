import { NextResponse } from 'next/server';
import { z } from 'zod';
import { assertAdmin } from '@/lib/authz';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const createItemSchema = z.object({
  item_name: z.string().trim().min(1),
  crafting_recipe: z.string().trim().min(1),
  notes: z.string().trim().optional().default(''),
  image_url: z.string().trim().url().optional().or(z.literal('')).nullable().default(''),
  image_path: z.string().trim().optional().nullable().default('')
});

const updateItemSchema = createItemSchema.extend({
  id: z.string().uuid()
});

const deleteItemSchema = z.object({
  id: z.string().uuid()
});

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('item_recipes')
    .select('id,item_name,crafting_recipe,notes,image_url,image_path,created_at,updated_at')
    .order('item_name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const profile = await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const payload = createItemSchema.parse(await request.json());

  const { data, error } = await supabase
    .from('item_recipes')
    .insert({
      ...payload,
      image_url: payload.image_url || null,
      image_path: payload.image_path || null,
      created_by: profile.id,
      updated_by: profile.id
    })
    .select('id,item_name,crafting_recipe,notes,image_url,image_path,created_at,updated_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ item: data });
}

export async function PATCH(request: Request) {
  const profile = await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const payload = updateItemSchema.parse(await request.json());

  const { data, error } = await supabase
    .from('item_recipes')
    .update({
      item_name: payload.item_name,
      crafting_recipe: payload.crafting_recipe,
      notes: payload.notes,
      image_url: payload.image_url || null,
      image_path: payload.image_path || null,
      updated_by: profile.id
    })
    .eq('id', payload.id)
    .select('id,item_name,crafting_recipe,notes,image_url,image_path,created_at,updated_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request) {
  await assertAdmin();
  const supabase = await createServerSupabaseClient();
  const payload = deleteItemSchema.parse(await request.json());

  const { error } = await supabase.from('item_recipes').delete().eq('id', payload.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
