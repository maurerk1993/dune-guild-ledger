'use client';

import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

type LedgerEntry = { id: string; name: string; quantity_owed: number; status: string; notes: string | null };

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [role, setRole] = useState('member');

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('ledger_entries').select('id,name,quantity_owed,status,notes').order('created_at', { ascending: false });
    setEntries((data ?? []) as LedgerEntry[]);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single();
      if (profile?.role) setRole(profile.role);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="space-y-4">
      {role === 'admin' && <div className="card space-y-2">
        <h2 className="text-lg font-semibold">Owed items ledger</h2>
        <div className="flex gap-2">
          <input placeholder="Item" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <button
            className="btn-primary"
            onClick={async () => {
              await fetch('/api/ledger', { method: 'POST', body: JSON.stringify({ name, quantity_owed: quantity, status: 'owed' }) });
              setName('');
              setQuantity(1);
              await load();
            }}
          >
            Add
          </button>
        </div>
      </div>}
      <div className="card table-shell overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th>Name</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} >
                <td>{entry.name}</td><td>{entry.quantity_owed}</td><td>{entry.status}</td>
                <td>
                  <button className="btn-secondary" onClick={async () => {
                    await fetch('/api/fulfillment-requests', { method: 'POST', body: JSON.stringify({ ledger_entry_id: entry.id }) });
                  }}>Request fulfillment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
