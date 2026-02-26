'use client';

import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

type Member = { id: string; display_name: string; rank: string | null; handle: string | null };
type Field = { field_key: string; label: string; type: string; order_index: number };

type DraftMember = {
  id: string;
  display_name: string;
  handle: string;
  rank: string;
};

export default function RosterPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [rank, setRank] = useState('');
  const [role, setRole] = useState('member');
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, DraftMember>>({});

  async function load() {
    const supabase = createClient();
    const [{ data: m }, { data: f }] = await Promise.all([
      supabase.from('roster_members').select('id,display_name,rank,handle').order('display_name'),
      supabase.from('roster_fields').select('field_key,label,type,order_index').order('order_index')
    ]);
    const loadedMembers = (m ?? []) as Member[];
    setMembers(loadedMembers);
    setFields((f ?? []) as Field[]);

    setDrafts(
      loadedMembers.reduce<Record<string, DraftMember>>((acc, member) => {
        acc[member.id] = {
          id: member.id,
          display_name: member.display_name,
          handle: member.handle ?? '',
          rank: member.rank ?? ''
        };
        return acc;
      }, {})
    );

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single();
      if (profile?.role) setRole(profile.role);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveMember(memberId: string) {
    const draft = drafts[memberId];
    if (!draft) return;

    await fetch('/api/roster/members', {
      method: 'PATCH',
      body: JSON.stringify({
        id: memberId,
        display_name: draft.display_name,
        handle: draft.handle || null,
        rank: draft.rank || null
      })
    });

    await load();
  }

  return (
    <section className="space-y-4">
      {role === 'admin' && (
        <div>
          <button className="bg-dune-gold text-slate-900" onClick={() => setShowAdminControls((current) => !current)}>
            {showAdminControls ? 'Hide admin controls' : 'Show admin controls'}
          </button>
        </div>
      )}
      {role === 'admin' && showAdminControls && (
        <div className="card">
          <h2 className="text-lg font-semibold">Guild roster</h2>
          <div className="mt-2 grid gap-2 md:grid-cols-4">
            <input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <input placeholder="Handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
            <input placeholder="Rank" value={rank} onChange={(e) => setRank(e.target.value)} />
            <button
              className="text-slate-900"
              style={{ background: 'var(--accent)' }}
              onClick={async () => {
                await fetch('/api/roster/members', {
                  method: 'POST',
                  body: JSON.stringify({ display_name: displayName, handle: handle || null, rank: rank || null })
                });
                setDisplayName('');
                setHandle('');
                setRank('');
                await load();
              }}
            >
              Add member
            </button>
          </div>
          <p className="mt-2 text-xs thematic-subtitle">Admins can update display name, handle, and rank directly in the roster table below.</p>
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Handle</th>
              <th className="pb-2">Rank</th>
              {fields.map((f) => (
                <th key={f.field_key} className="pb-2">{f.label}</th>
              ))}
              {role === 'admin' && showAdminControls && <th className="pb-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t" style={{ borderColor: 'var(--panel-border)' }}>
                <td className="py-2 pr-2">
                  {role === 'admin' && showAdminControls ? (
                    <input
                      value={drafts[m.id]?.display_name ?? ''}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [m.id]: { ...prev[m.id], display_name: e.target.value } }))}
                    />
                  ) : (
                    m.display_name
                  )}
                </td>
                <td className="py-2 pr-2">
                  {role === 'admin' && showAdminControls ? (
                    <input
                      value={drafts[m.id]?.handle ?? ''}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [m.id]: { ...prev[m.id], handle: e.target.value } }))}
                    />
                  ) : (
                    m.handle || '—'
                  )}
                </td>
                <td className="py-2 pr-2">
                  {role === 'admin' && showAdminControls ? (
                    <input
                      value={drafts[m.id]?.rank ?? ''}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [m.id]: { ...prev[m.id], rank: e.target.value } }))}
                    />
                  ) : (
                    m.rank || '—'
                  )}
                </td>
                {fields.map((f) => <td key={f.field_key}>—</td>)}
                {role === 'admin' && showAdminControls && (
                  <td>
                    <button
                      style={{ background: 'var(--accent-soft)', color: '#101722' }}
                      onClick={async () => {
                        await saveMember(m.id);
                      }}
                    >
                      Save
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
