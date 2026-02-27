'use client';

import { createClient } from '@/lib/supabase-client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RequiredProfileNameModal() {
  const pathname = usePathname();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [duneUsername, setDuneUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (pathname.startsWith('/auth')) return;

      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', authData.user.id)
        .single<{ id: string; display_name: string | null }>();

      if (!profile) return;

      const currentName = profile.display_name?.trim() ?? '';
      setProfileId(profile.id);
      setDuneUsername(currentName);
      setIsOpen(!currentName);
    }

    void loadProfile();
  }, [pathname]);

  if (!isOpen || pathname.startsWith('/auth')) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
      <section className="card w-full max-w-md space-y-3">
        <h2 className="text-lg font-semibold">Set your in-game Dune username</h2>
        <p className="text-sm thematic-subtitle">
          This is required. It is important that this matches your in-game name for rewards and contribution tracking.
        </p>
        <input
          value={duneUsername}
          placeholder="In-game Dune username"
          onChange={(event) => setDuneUsername(event.target.value)}
          autoFocus
        />
        <button
          className="btn-primary w-full"
          disabled={isSaving}
          onClick={async () => {
            if (!profileId) return;
            const nextName = duneUsername.trim();
            if (!nextName) {
              setStatus('Please enter your in-game Dune username.');
              return;
            }

            setIsSaving(true);
            setStatus(null);
            const supabase = createClient();
            const { error } = await supabase.from('profiles').update({ display_name: nextName }).eq('id', profileId);

            setIsSaving(false);
            if (error) {
              setStatus(error.message);
              return;
            }

            setDuneUsername(nextName);
            setIsOpen(false);
          }}
        >
          Save username
        </button>
        {status && <p className="text-xs thematic-subtitle">{status}</p>}
      </section>
    </div>
  );
}
