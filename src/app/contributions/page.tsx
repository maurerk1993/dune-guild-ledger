'use client';

import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

type Action = {
  id: string;
  label: string;
  description: string | null;
  points: number;
  is_active: boolean;
};
type Log = {
  id: string;
  created_at: string;
  actor_name: string | null;
  action_label: string | null;
  points_awarded: number;
  contribution_actions: { label: string; points: number } | null;
  profiles: { email: string; display_name: string | null; contribution_points: number } | null;
};
type RawLog = {
  id: string;
  created_at: string;
  actor_name: string | null;
  action_label: string | null;
  points_awarded: number;
  contribution_actions: { label: string; points: number }[] | null;
  profiles: { email: string; display_name: string | null; contribution_points: number }[] | null;
};

export default function ContributionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [label, setLabel] = useState('');
  const [points, setPoints] = useState(1);
  const [role, setRole] = useState('member');

  async function load() {
    const supabase = createClient();
    const [{ data: a }, { data: l }] = await Promise.all([
      supabase
        .from('contribution_actions')
        .select('id,label,description,points,is_active')
        .order('sort_order')
        .returns<Action[]>(),
      supabase
        .from('contribution_logs')
        .select('id,created_at,actor_name,action_label,points_awarded,contribution_actions(label,points),profiles(email,display_name,contribution_points)')
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
      points_awarded: log.points_awarded,
      contribution_actions: log.contribution_actions?.[0] ?? null,
      profiles: log.profiles?.[0] ?? null
    }));
    setLogs(normalizedLogs);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.user.id)
        .single();
      if (profile?.role) setRole(profile.role);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Contribution actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.filter((action) => action.is_active).map((action) => (
            <button
              key={action.id}
              className="bg-dune-azure text-slate-900"
              onClick={async () => {
                await fetch('/api/contributions/logs', { method: 'POST', body: JSON.stringify({ action_id: action.id }) });
                await load();
              }}
            >
              {action.label} (+{action.points} pts)
            </button>
          ))}
        </div>
      </div>
      {role === 'admin' && (
        <div className="card space-y-3">
          <h3 className="font-semibold">Admin: manage actions</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <input placeholder="Action label" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input
              type="number"
              min={0}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value) || 0)}
              className="w-24"
              aria-label="Action points"
            />
            <button
              className="bg-dune-gold text-slate-900"
              onClick={async () => {
                await fetch('/api/contributions/actions', {
                  method: 'POST',
                  body: JSON.stringify({ label, points, is_active: true })
                });
                setLabel('');
                setPoints(1);
                await load();
              }}
            >
              Add action
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action.id} className="border-t border-dune-azure/20">
                    <td>{action.label}</td>
                    <td>{action.points}</td>
                    <td>{action.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="space-x-2">
                      <button
                        className="bg-dune-gold text-slate-900"
                        onClick={async () => {
                          const nextLabel = window.prompt('Update action label', action.label);
                          if (!nextLabel) return;
                          const nextPointsRaw = window.prompt('Set points value (0 or higher)', String(action.points));
                          if (nextPointsRaw === null) return;
                          const nextPoints = Number(nextPointsRaw);
                          if (Number.isNaN(nextPoints) || nextPoints < 0) return;
                          await fetch('/api/contributions/actions', {
                            method: 'PATCH',
                            body: JSON.stringify({ id: action.id, label: nextLabel, points: nextPoints })
                          });
                          await load();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-slate-600 text-white"
                        onClick={async () => {
                          await fetch('/api/contributions/actions', {
                            method: 'PATCH',
                            body: JSON.stringify({ id: action.id, is_active: !action.is_active })
                          });
                          await load();
                        }}
                      >
                        {action.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="bg-red-500 text-white"
                        onClick={async () => {
                          const confirmed = window.confirm('Delete this action? Existing logs for it will also be deleted.');
                          if (!confirmed) return;
                          await fetch('/api/contributions/actions', {
                            method: 'DELETE',
                            body: JSON.stringify({ id: action.id })
                          });
                          await load();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Points</th>
              {role === 'admin' && <th>Admin</th>}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const displayUser = log.actor_name ?? log.profiles?.display_name ?? log.profiles?.email ?? 'unknown';
              const displayAction = log.action_label ?? log.contribution_actions?.label ?? 'Unknown contribution';
              return (
                <tr key={log.id} className="border-t border-dune-azure/20">
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{displayUser}</td>
                  <td>{displayAction}</td>
                  <td>{log.points_awarded}</td>
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
