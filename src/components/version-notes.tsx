export const appVersion = '0.1.6';

export const patchNotes = [
  {
    version: '0.1.6',
    notes: [
      'Locked global navigation and sign-out controls behind authenticated sessions so visitors on sign-in and sign-up screens no longer see in-app tabs.',
      'Restricted the Admin page itself to admin users server-side and removed the Admin tab for non-admin members.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.1.5',
    notes: [
      'Enforced authentication in middleware so unauthenticated visitors are redirected to account registration before accessing any protected pages.',
      'Updated the home route to send new visitors to sign up and keep signed-in users routed directly to the dashboard.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.1.4',
    notes: [
      'Updated Next.js and eslint-config-next to 15.2.4 to remediate the vulnerable framework version flagged during deployment checks.',
      'Bumped the app release version to 0.1.4 so the dashboard and package metadata stay aligned with this security patch.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.1.3',
    notes: [
      'Added Vercel project configuration so deployments use the Next.js build output instead of expecting a static public folder.',
      'Resolved deployment failure caused by Output Directory mismatch in Vercel settings.',
      'No database migration is required for this release.'
    ]
  },
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
