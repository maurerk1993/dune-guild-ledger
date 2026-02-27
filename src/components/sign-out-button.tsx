'use client';

import { createClient } from '@/lib/supabase-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      className="btn-secondary flex items-center gap-2"
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.replace('/auth/login');
      }}
    >
      <LogOut size={15} aria-hidden="true" />
      Sign out
    </button>
  );
}
