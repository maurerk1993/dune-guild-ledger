'use client';

import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

type Action = { id: string; label: string; description: string | null; is_active: boolean };
type Log = {
  id: string;
  created_at: string;
  actor_name: string | null;
  action_label: string | null;
  contribution_actions: { label: string } | null;
  profiles: { email: string; display_name: string | null } | null;
};
type RawLog = {
  id: string;
  created_at: string;
  actor_name: string | null;
  action_label: string | null;
  contribution_actions: { label: string }[] | null;
  profiles: { email: string; display_name: string | null }[] | null;
};

export default function ContributionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [label, setLabel] = useState('');
  const [role, setRole] = useState('member');

  async function load() {
    const supabase = createClient();
    const [{ data: a }, { data: l }] = await Promise.all([
      supabase
        .from('contribution_actions')
        .select('id,label,description,is_active')
        .eq('is_active', true)
        .order('sort_order')
        .returns<Action[]>(),
      supabase
        .from('contribution_logs')
        .select('id,created_at,actor_name,action_label,contribution_actions(label),profiles(email,display_name)')
        .order('created_at', { ascending: false })
        .limit(25)
        .returns<RawLog[]>()
    ]);
    setActions(a ?? []);
    const normalizedLogs: Log[] = (l ?? []).map((log) => ({
      id: log.id,
      created_at: log.created_at,
      actor_name: log.actor_name,
      action_label: log.action_label,
      contribution_actions: log.contribution_actions?.[0] ?? null,
      profiles: log.profiles?.[0] ?? null
    }));
    setLogs(normalizedLogs);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single();
      if (profile?.role) setRole(profile.role);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Contribution actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((action) => (
            <button key={action.id} className="bg-dune-azure text-slate-900" onClick={async () => {
              await fetch('/api/contributions/logs', { method: 'POST', body: JSON.stringify({ action_id: action.id }) });
              await load();
            }}>{action.label}</button>
          ))}
        </div>
      </div>
      {role === 'admin' && <div className="card">
        <h3 className="font-semibold">Admin: manage actions</h3>
        <div className="mt-2 flex gap-2">
          <input placeholder="Action label" value={label} onChange={(e) => setLabel(e.target.value)} />
          <button className="bg-dune-gold text-slate-900" onClick={async () => {
            await fetch('/api/contributions/actions', { method: 'POST', body: JSON.stringify({ label, is_active: true }) });
            setLabel('');
            await load();
          }}>Add action</button>
        </div>
      </div>}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th>Timestamp</th><th>User</th><th>Action</th>{role === 'admin' && <th>Admin</th>}</tr></thead>
          <tbody>
            {logs.map((log) => {
              const displayUser = log.actor_name ?? log.profiles?.display_name ?? log.profiles?.email ?? 'unknown';
              const displayAction = log.action_label ?? log.contribution_actions?.label ?? 'Unknown contribution';
              return (
                <tr key={log.id} className="border-t border-dune-azure/20">
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{displayUser}</td>
                  <td>{displayAction}</td>
                  {role === 'admin' && (
                    <td>
                      <button
                        className="bg-red-500 text-white"
                        onClick={async () => {
                          await fetch('/api/contributions/logs', { method: 'DELETE', body: JSON.stringify({ id: log.id }) });
                          await load();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
