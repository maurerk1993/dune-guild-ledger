'use client';

import { useState } from 'react';
import { appVersion, patchNotes } from '@/components/version-notes';

export function ChangeLogFab() {
  const [open, setOpen] = useState(false);
  const recentNotes = patchNotes.slice(0, 3);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 border px-3 py-2 text-xs"
        style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)', color: 'var(--text)' }}
        onClick={() => setOpen((current) => !current)}
      >
        Change Log
      </button>
      {open && (
        <aside
          className="fixed bottom-20 right-5 z-50 max-h-[70vh] w-[min(26rem,calc(100vw-2.5rem))] overflow-y-auto rounded-xl border p-4 shadow-2xl"
          style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)', color: 'var(--text)' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent updates (v{appVersion})</h2>
            <button type="button" onClick={() => setOpen(false)} className="px-2 py-1 text-xs" style={{ background: 'var(--accent-soft)', color: '#101722' }}>
              Close
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {recentNotes.map((entry) => (
              <div key={entry.version}>
                <p className="font-semibold" style={{ color: 'var(--accent)' }}>
                  {entry.version}
                </p>
                <ul className="list-disc pl-5">
                  {entry.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
