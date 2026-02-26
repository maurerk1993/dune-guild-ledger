'use client';

import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

type Member = { id: string; display_name: string; rank: string | null; handle: string | null };
type Field = { field_key: string; label: string; type: string; order_index: number };

export default function RosterPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('member');

  async function load() {
    const supabase = createClient();
    const [{ data: m }, { data: f }] = await Promise.all([
      supabase.from('roster_members').select('id,display_name,rank,handle').order('display_name'),
      supabase.from('roster_fields').select('field_key,label,type,order_index').order('order_index')
    ]);
    setMembers((m ?? []) as Member[]);
    setFields((f ?? []) as Field[]);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single();
      if (profile?.role) setRole(profile.role);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="space-y-4">
      {role === 'admin' && <div className="card">
        <h2 className="text-lg font-semibold">Guild roster</h2>
        <div className="mt-2 flex gap-2">
          <input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <button className="bg-dune-gold text-slate-900" onClick={async () => {
            await fetch('/api/roster/members', { method: 'POST', body: JSON.stringify({ display_name: displayName }) });
            setDisplayName('');
            await load();
          }}>Add member</button>
        </div>
      </div>}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th>Name</th><th>Handle</th><th>Rank</th>{fields.map((f) => <th key={f.field_key}>{f.label}</th>)}</tr></thead>
          <tbody>{members.map((m) => <tr key={m.id} className="border-t border-dune-azure/20"><td>{m.display_name}</td><td>{m.handle}</td><td>{m.rank}</td>{fields.map((f)=><td key={f.field_key}>—</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
