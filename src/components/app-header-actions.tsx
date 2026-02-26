'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Nav } from '@/components/nav';
import { SignOutButton } from '@/components/sign-out-button';

type Role = 'member' | 'admin' | null;

export function AppHeaderActions() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setIsAuthenticated(false);
        setRole(null);
        return;
      }

      setIsAuthenticated(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle<{ role: 'member' | 'admin' }>();

      setRole(profile?.role ?? 'member');
    }

    void loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
      if (!session?.user) {
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (pathname.startsWith('/auth') || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Nav role={role} />
      <SignOutButton />
    </div>
  );
}
