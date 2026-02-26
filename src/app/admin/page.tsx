import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/authz';
import { AdminControls } from '@/components/admin-controls';

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminControls />;
}
