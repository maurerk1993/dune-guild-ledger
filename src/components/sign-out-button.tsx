'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      className="bg-dune-azure text-slate-950"
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
