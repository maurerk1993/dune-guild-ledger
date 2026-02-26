import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentProfile } from '@/lib/authz';

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const supabase = await createServerSupabaseClient();

  const [{ count: ledgerCount }, { count: rosterCount }, { count: contributionCount }] = await Promise.all([
    supabase.from('ledger_entries').select('*', { count: 'exact', head: true }),
    supabase.from('roster_members').select('*', { count: 'exact', head: true }),
    supabase.from('contribution_logs').select('*', { count: 'exact', head: true })
  ]);

  return (
    <section className="grid gap-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Welcome, {profile?.email}</h2>
        <p className="text-sm thematic-subtitle">Role: {profile?.role}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p>Ledger entries</p><p className="text-2xl thematic-title">{ledgerCount ?? 0}</p></div>
        <div className="card"><p>Roster members</p><p className="text-2xl thematic-title">{rosterCount ?? 0}</p></div>
        <div className="card"><p>Contribution logs</p><p className="text-2xl thematic-title">{contributionCount ?? 0}</p></div>
      </div>
      <div className="card">
        <h3 className="font-semibold thematic-title">Guild Operations Overview</h3>
        <p className="mt-2 text-sm thematic-subtitle">
          Track resource obligations, maintain your active roster, and monitor contribution activity from one control hub.
          Open the Change Log button in the lower-right corner for the latest release notes.
        </p>
      </div>
    </section>
  );
}
