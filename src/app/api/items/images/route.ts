import { NextResponse } from 'next/server';
import { z } from 'zod';
import { assertAdmin } from '@/lib/authz';
import { createAdminClient } from '@/lib/supabase-admin';

const BUCKET = 'item-images';
const deleteSchema = z.object({ image_path: z.string().min(1) });

export async function POST(request: Request) {
  await assertAdmin();
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  const imagePath = `items/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const { error } = await admin.storage.from(BUCKET).upload(imagePath, file, {
    cacheControl: '3600',
    contentType: file.type || 'application/octet-stream',
    upsert: false
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(imagePath);

  return NextResponse.json({ image_url: data.publicUrl, image_path: imagePath });
}

export async function DELETE(request: Request) {
  await assertAdmin();
  const payload = deleteSchema.parse(await request.json());
  const admin = createAdminClient();

  const { error } = await admin.storage.from(BUCKET).remove([payload.image_path]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
