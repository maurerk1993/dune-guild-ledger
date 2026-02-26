import { getCurrentProfile } from '@/lib/authz';

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  return (
    <section className="card max-w-lg">
      <h2 className="text-lg font-semibold">Account</h2>
      <p className="mt-2 text-sm">Email: {profile?.email}</p>
      <p className="text-sm">Role: {profile?.role}</p>
    </section>
  );
}
