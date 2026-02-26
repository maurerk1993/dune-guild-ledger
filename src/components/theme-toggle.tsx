'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'dune-ledger-theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = storedTheme ?? (preferredDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
    setReady(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="border"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)', color: 'var(--text)' }}
      aria-label="Toggle theme"
    >
      {ready ? (theme === 'dark' ? 'Switch to Light' : 'Switch to Dark') : 'Theme'}
    </button>
  );
}
