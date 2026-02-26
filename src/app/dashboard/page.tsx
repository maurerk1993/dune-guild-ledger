import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentProfile } from '@/lib/authz';
import { appVersion, patchNotes } from '@/components/version-notes';

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
        <p className="text-sm">Role: {profile?.role}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p>Ledger entries</p><p className="text-2xl text-dune-gold">{ledgerCount ?? 0}</p></div>
        <div className="card"><p>Roster members</p><p className="text-2xl text-dune-gold">{rosterCount ?? 0}</p></div>
        <div className="card"><p>Contribution logs</p><p className="text-2xl text-dune-gold">{contributionCount ?? 0}</p></div>
      </div>
      <div className="card">
        <h3 className="font-semibold">Version {appVersion}</h3>
        {patchNotes.map((entry) => (
          <div key={entry.version}>
            <p className="mt-2 text-dune-gold">{entry.version}</p>
            <ul className="list-disc pl-6 text-sm">
              {entry.notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
