'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Role = 'member' | 'admin' | null;

const links = [
  ['Dashboard', '/dashboard'],
  ['Ledger', '/ledger'],
  ['Roster', '/roster'],
  ['Contributions', '/contributions'],
  ['Admin', '/admin'],
  ['Account', '/account']
] as const;

export function Nav({ role }: { role: Role }) {
  const pathname = usePathname();

  const visibleLinks = links.filter(([label]) => label !== 'Admin' || role === 'admin');

  return (
    <nav className="nav-shell">
      {visibleLinks.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className={`nav-link ${pathname.startsWith(href) ? 'nav-link-active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
