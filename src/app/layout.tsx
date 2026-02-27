import './globals.css';
import { AppHeaderActions } from '@/components/app-header-actions';
import { ChangeLogFab } from '@/components/change-log-fab';
import { RequiredProfileNameModal } from '@/components/required-profile-name-modal';
import { BadgeCheck, Orbit } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-6xl p-6 pb-24">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--panel-border)' }}>
            <div>
              <h1 className="thematic-title flex items-center gap-2 text-2xl font-semibold">
                <Orbit size={22} aria-hidden="true" />
                The Black Templars Guild Ledger
                <BadgeCheck size={20} aria-hidden="true" />
              </h1>
              <p className="thematic-subtitle text-sm">The official app for The Black Templars. Currently in ALPHA.</p>
            </div>
            <AppHeaderActions />
          </header>
          {children}
        </main>
        <ChangeLogFab />
        <RequiredProfileNameModal />
      </body>
    </html>
  );
}
