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
    <nav className="flex flex-wrap gap-2">
      {visibleLinks.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className={`rounded-lg px-3 py-2 ${pathname.startsWith(href) ? 'bg-dune-gold text-slate-900' : 'bg-slate-800 text-dune-sand'}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
