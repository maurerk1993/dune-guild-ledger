'use client';

import { useState } from 'react';

export function AdminControls() {
  const [email, setEmail] = useState('');

  return (
    <section className="card max-w-lg space-y-3">
      <h2 className="text-lg font-semibold">Admin controls</h2>
      <p className="text-sm">Grant or revoke admin role by email.</p>
      <input placeholder="member@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex gap-2">
        <button className="bg-dune-gold text-slate-900" onClick={() => fetch('/api/admin/roles', { method: 'PATCH', body: JSON.stringify({ email, role: 'admin' }) })}>Grant admin</button>
        <button className="bg-slate-700" onClick={() => fetch('/api/admin/roles', { method: 'PATCH', body: JSON.stringify({ email, role: 'member' }) })}>Revoke admin</button>
      </div>
    </section>
  );
}
