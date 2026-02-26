'use client';

import { useState } from 'react';

type Props = {
  initialMessage: string;
  isAdmin: boolean;
};

export function MotdCard({ initialMessage, isAdmin }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const [draft, setDraft] = useState(initialMessage);
  const [status, setStatus] = useState<string | null>(null);

  async function saveMessage() {
    setStatus(null);
    const response = await fetch('/api/app-settings', {
      method: 'PATCH',
      body: JSON.stringify({ message_of_the_day: draft })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(payload?.error ?? 'Unable to update message of the day.');
      return;
    }

    setMessage(draft);
    setStatus('Message of the day updated.');
  }

  return (
    <div className="card">
      <h3 className="font-semibold thematic-title">Message of the Day</h3>
      <p className="mt-2 text-sm thematic-subtitle">{message}</p>
      {isAdmin && (
        <div className="mt-3 space-y-2">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} />
          <button className="bg-dune-gold text-slate-900" onClick={saveMessage}>
            Save message
          </button>
          {status && <p className="text-xs thematic-subtitle">{status}</p>}
        </div>
      )}
    </div>
  );
}
