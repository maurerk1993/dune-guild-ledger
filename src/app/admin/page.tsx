import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/authz';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { AdminControls } from '@/components/admin-controls';

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  const supabase = await createServerSupabaseClient();
  const { data: users } = await supabase
    .from('profiles')
    .select('id,email,display_name,role')
    .order('created_at', { ascending: true });

  return <AdminControls initialUsers={users ?? []} currentUserId={profile.id} />;
}
