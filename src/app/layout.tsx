import './globals.css';
import { AppHeaderActions } from '@/components/app-header-actions';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-dune-azure/30 pb-4">
            <div>
              <h1 className="text-2xl font-semibold text-dune-gold">Atreides Guild Ledger</h1>
              <p className="text-sm text-dune-azure">Noble records for Dune: Awakening guild logistics.</p>
            </div>
            <AppHeaderActions />
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
