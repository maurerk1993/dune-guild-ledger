export const appVersion = '0.1.1';

export const patchNotes = [
  {
    version: '0.1.1',
    notes: [
      'Fixed a TypeScript compile error in middleware cookie handling that blocked first-time Vercel deployments.',
      'Improved middleware cookie typing to satisfy strict TypeScript checks in production builds.'
    ]
  },
  {
    version: '0.1.0',
    notes: [
      'Initial MVP release of Atreides Guild Ledger.',
      'Added authentication, ledger tracking, roster customization, and contributions logging.',
      'Added Supabase SQL migrations with RLS and a deployment runbook for Supabase + Vercel.'
    ]
  }
];
