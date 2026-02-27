import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentProfile } from '@/lib/authz';
import { MotdCard } from '@/components/motd-card';

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const supabase = await createServerSupabaseClient();

  const [{ count: ledgerCount }, { count: rosterCount }, { count: contributionCount }] = await Promise.all([
    supabase.from('ledger_entries').select('*', { count: 'exact', head: true }),
    supabase.from('roster_members').select('*', { count: 'exact', head: true }),
    supabase.from('contribution_logs').select('*', { count: 'exact', head: true })
  ]);

  const { data: settings } = await supabase
    .from('app_settings')
    .select('message_of_the_day')
    .eq('id', 1)
    .single<{ message_of_the_day: string }>();

  const displayName = profile?.display_name?.trim() || profile?.email;

  return (
    <section className="grid gap-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Welcome, {displayName}</h2>
        <p className="text-sm thematic-subtitle">Role: {profile?.role}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p>Ledger entries</p><p className="text-2xl thematic-title">{ledgerCount ?? 0}</p></div>
        <div className="card"><p>Roster members</p><p className="text-2xl thematic-title">{rosterCount ?? 0}</p></div>
        <div className="card"><p>Contribution logs</p><p className="text-2xl thematic-title">{contributionCount ?? 0}</p></div>
      </div>
      <MotdCard initialMessage={settings?.message_of_the_day ?? 'Welcome to Dune Guild Ledger.'} isAdmin={profile?.role === 'admin'} />
    </section>
  );
}
