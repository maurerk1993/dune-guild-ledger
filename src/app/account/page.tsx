'use client';

import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  contribution_points: number;
};

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data } = await supabase
        .from('profiles')
        .select('id,email,display_name,role,contribution_points')
        .eq('id', authData.user.id)
        .single<Profile>();

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name ?? '');
      }
    }

    void loadProfile();
  }, []);

  const effectiveName = profile?.display_name?.trim() || profile?.email;

  return (
    <section className="card max-w-lg space-y-3">
      <h2 className="text-lg font-semibold">Account</h2>
      <p className="text-sm">Profile name: {effectiveName ?? '—'}</p>
      <p className="text-sm">Email: {profile?.email ?? '—'}</p>
      <p className="text-sm">Role: {profile?.role ?? '—'}</p>
      <p className="text-sm">Contribution points: {profile?.contribution_points ?? 0}</p>
      <div className="space-y-2 border-t pt-3" style={{ borderColor: 'var(--panel-border)' }}>
        <h3 className="font-semibold">Edit profile name</h3>
        <input value={displayName} placeholder="How your name appears" onChange={(event) => setDisplayName(event.target.value)} />
        <button
          className="btn-primary"
          onClick={async () => {
            if (!profile) return;
            const supabase = createClient();
            const { error } = await supabase.from('profiles').update({ display_name: displayName || null }).eq('id', profile.id);
            if (error) {
              setStatus(error.message);
              return;
            }
            setProfile({ ...profile, display_name: displayName || null });
            setStatus('Profile name updated.');
          }}
        >
          Save profile name
        </button>
        {status && <p className="text-xs thematic-subtitle">{status}</p>}
      </div>
    </section>
  );
}
