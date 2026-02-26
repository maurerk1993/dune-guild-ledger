'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      style={{ background: 'var(--accent-soft)', color: '#101722' }}
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.replace('/auth/login');
      }}
    >
      Sign out
    </button>
  );
}
