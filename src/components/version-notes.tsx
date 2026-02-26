export const appVersion = '0.1.2';

export const patchNotes = [
  {
    version: '0.1.2',
    notes: [
      'Hardened contribution log query typing so Vercel no longer treats joined action/profile records as an incompatible shape.',
      'Reworked the contributions page data load to use explicit Supabase return typing and safe normalization before rendering.',
      'No database migration is required for this update.'
    ]
  },
  {
    version: '0.1.1',
    notes: [
      'Fixed Vercel build failure on the contributions page by normalizing Supabase relation results before rendering.',
      'Improved contribution log type handling to safely map joined profile and action records.',
      'No database migration needed for this patch release.'
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
