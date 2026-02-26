import './globals.css';
import { AppHeaderActions } from '@/components/app-header-actions';
import { ChangeLogFab } from '@/components/change-log-fab';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-6xl p-6 pb-24">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--panel-border)' }}>
            <div>
              <h1 className="thematic-title text-2xl font-semibold">The Black Templars Ledger</h1>
              <p className="thematic-subtitle text-sm">The official app created by The Black Templars, for The Black Templars.</p>
            </div>
            <AppHeaderActions />
          </header>
          {children}
        </main>
        <ChangeLogFab />
      </body>
    </html>
  );
}
