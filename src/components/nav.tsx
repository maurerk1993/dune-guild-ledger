'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenText, LayoutGrid, Shield, Star, Sword, UserCircle2 } from 'lucide-react';

type Role = 'member' | 'admin' | null;

const links = [
  ['Dashboard', '/dashboard', LayoutGrid],
  ['Ledger', '/ledger', BookOpenText],
  ['Roster', '/roster', Shield],
  ['Contributions', '/contributions', Sword],
  ['Admin', '/admin', Star],
  ['Account', '/account', UserCircle2]
] as const;

export function Nav({ role }: { role: Role }) {
  const pathname = usePathname();

  const visibleLinks = links.filter(([label]) => label !== 'Admin' || role === 'admin');

  return (
    <nav className="nav-shell">
      {visibleLinks.map(([label, href, Icon]) => (
        <Link
          key={href}
          href={href}
          className={`nav-link ${pathname.startsWith(href) ? 'nav-link-active' : ''}`}
        >
          <Icon size={16} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
