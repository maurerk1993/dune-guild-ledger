import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getCurrentProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', auth.user.id)
    .single();

  return profile;
}

export async function assertAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return profile;
}
