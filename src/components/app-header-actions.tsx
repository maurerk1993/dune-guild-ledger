'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Nav } from '@/components/nav';
import { SignOutButton } from '@/components/sign-out-button';
import { ThemeToggle } from '@/components/theme-toggle';

type Role = 'member' | 'admin' | null;

export function AppHeaderActions() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [guildPoints, setGuildPoints] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setIsAuthenticated(false);
        setRole(null);
        setGuildPoints(0);
        return;
      }

      setIsAuthenticated(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role,contribution_points')
        .eq('id', authData.user.id)
        .maybeSingle<{ role: 'member' | 'admin'; contribution_points: number | null }>();

      setRole(profile?.role ?? 'member');
      setGuildPoints(profile?.contribution_points ?? 0);
    }

    void loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
      if (!session?.user) {
        setRole(null);
        setGuildPoints(0);
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
    <div className="flex w-full flex-wrap items-center justify-end gap-3 xl:flex-nowrap">
      <div
        className="card shrink-0 px-3 py-2 text-sm"
        title="Redeem Guild Points for rewards such as Melange, Blueprints and End game materials. Guild Points are earned by Contributing to the guild."
      >
        <span className="font-semibold">Guild Points:</span> {guildPoints}
      </div>
      <div className="min-w-[18rem] flex-1">
        <Nav role={role} />
      </div>
      <ThemeToggle />
      <SignOutButton />
    </div>
  );
}
