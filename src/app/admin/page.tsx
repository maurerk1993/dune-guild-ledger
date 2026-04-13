import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/authz';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { AdminControls } from '@/components/admin-controls';
import { AdminItemManager } from '@/components/items/admin-item-manager';

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  const supabase = await createServerSupabaseClient();
  const [{ data: users }, { data: items }] = await Promise.all([
    supabase.from('profiles').select('id,email,display_name,role').order('created_at', { ascending: true }),
    supabase.from('item_recipes').select('id,item_name,crafting_recipe,notes,image_url,image_path').order('item_name', { ascending: true })
  ]);

  return (
    <section className="space-y-4">
      <AdminControls initialUsers={users ?? []} currentUserId={profile.id} />
      <AdminItemManager initialItems={items ?? []} />
    </section>
  );
}
