'use client';

import { Pencil, X } from 'lucide-react';
import { useState } from 'react';

type Props = {
  initialMessage: string;
  isAdmin: boolean;
};

export function MotdCard({ initialMessage, isAdmin }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const [draft, setDraft] = useState(initialMessage);
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
    setStatus('Message of the day updated.');
  }

  function startEditing() {
    setStatus(null);
    setDraft(message);
    setIsEditing(true);
  }

  function cancelEditing() {
    setStatus(null);
    setDraft(message);
    setIsEditing(false);
  }

  return (
    <div className="card relative">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold thematic-title">Message of the Day</h3>
        {isAdmin && (
          <button
            className="btn-secondary !p-2"
            onClick={isEditing ? cancelEditing : startEditing}
            aria-label={isEditing ? 'Cancel editing message of the day' : 'Edit message of the day'}
            title={isEditing ? 'Cancel edit' : 'Edit message'}
          >
            {isEditing ? <X size={16} aria-hidden="true" /> : <Pencil size={16} aria-hidden="true" />}
          </button>
        )}
      </div>

      {!isEditing && <p className="mt-2 whitespace-pre-wrap text-sm thematic-subtitle">{message}</p>}

      {isAdmin && isEditing && (
        <div className="mt-3 space-y-2">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={saveMessage}>
              Save message
            </button>
            <button className="btn-secondary" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {status && <p className="mt-2 text-xs thematic-subtitle">{status}</p>}
    </div>
  );
}
