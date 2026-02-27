export const appVersion = '0.6.3';

export const patchNotes = [
  {
    version: '0.6.3',
    notes: [
      'Expanded the main application shell width so header controls have more room and no longer feel cramped in the center column.',
      'Improved header action layout to better distribute space between Guild Points, navigation, and utility buttons on wide screens.',
      'Updated navigation styling to stay on one row and scroll horizontally when needed, preventing the Admin tab from forcing a broken two-line menu.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.6.2',
    notes: [
      'Updated the app identity in the header to The Black Templars Guild Ledger and refreshed the subtitle to the new ALPHA messaging.',
      'Added a live Guild Points status box to the header so members can quickly see their current contribution total.',
      'Added hover help text to Guild Points explaining how points are earned and what rewards they can be redeemed for.',
      'Renamed "Contribution points" to "Guild Points" on the account page for consistent terminology across the app.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.6.1',
    notes: [
      'Fixed admin role management API regressions that caused production builds to fail linting and prevented role updates from targeting the correct profile record.',
      'Restored the v0.6.0 experience updates: Message of the Day editing flow, improved admin user-management UX, and required in-game username prompts/validation remain active.',
      'Renamed in-app branding to Dune Guild Ledger for consistency across the header and release notes.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.5.2',
    notes: [
      'Fixed admin role assignment so grant/revoke by email is now case-insensitive and trims accidental whitespace.',
      'Normalized profile email storage to lowercase for new and existing users so admin lookups and role updates stay consistent.',
      'Database migration required: run supabase/migrations/0005_case_insensitive_admin_role_assignment.sql before deploying this release.'
    ]
  },
  {
    version: '0.5.1',
    notes: [
      'Fixed a production crash caused by Supabase SSR attempting to write cookies during Server Component rendering.',
      'Updated server-side auth cookie handling to gracefully skip writes outside Middleware/Route Handlers while preserving session refresh in supported contexts.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.5.0',
    notes: [
      'Full Atreides command-interface facelift with a green tactical palette, layered HUD-like backgrounds, and upgraded card styling across the app.',
      'Refreshed buttons, tables, and navigation states so light and dark themes remain readable while still feeling like a game UI.',
      'Added dune-inspired iconography to the header, navigation, theme controls, and change-log launcher for a more immersive interface.',
      'No database migration is required for this release.'
    ]
  },
  {
    version: '0.4.0',
    notes: [
      'Added admin controls on Contributions so existing actions can now be edited, activated/deactivated, and fully deleted.',
      'Introduced point values for each contribution action and display points in both action buttons and contribution history.',
      'Contribution claims now snapshot awarded points and automatically maintain each member\'s running contribution point total in their profile.',
      'Database migration required: run supabase/migrations/0004_contribution_points_and_admin_log_delete.sql before deploying this release.'
    ]
  },
  {
    version: '0.3.2',
    notes: [
      'Added a database hotfix migration to safely remove the overly permissive profile read policy introduced during the 0.3.0/0.3.1 migration path.',
      'Made the policy fix idempotent so rerunning SQL no longer fails with "policy already exists" errors in partially migrated environments.',
      'Database migration required: run supabase/migrations/0003_profiles_policy_hotfix.sql after pulling this release.'
    ]
  },
  {
    version: '0.3.1',
    notes: [
      'Fixed the 0.3.0 migration script failure by correcting the contribution log backfill query so it runs successfully on Supabase/Postgres.',
      'No additional schema changes were introduced beyond the 0.3.0 migration, but this updated SQL must be used when applying that release.',
      'If your 0.3.0 migration previously failed, rerun supabase/migrations/0002_profile_names_motd_and_contribution_log_snapshots.sql after pulling this update.'
    ]
  },
  {
    version: '0.3.0',
    notes: [
      'Updated authentication entry flow so visitors are routed to sign in by default and both sign-in/create-account options are always available.',
      'Enhanced contribution logging with durable actor/action snapshots, retroactive backfill for existing logs, and admin-only delete controls for log entries.',
      'Added profile display names to account settings so users can replace email-based labels across the app once they set a preferred name.',
      'Reworked roster admin behavior to default to member view and reveal edit tools only after selecting the new "Show admin controls" toggle.',
      'Replaced the dashboard operations overview card with an admin-editable Message of the Day panel.',
      'Database migration required: run supabase/migrations/0002_profile_names_motd_and_contribution_log_snapshots.sql before deploying this release.'
    ]
  },
  {
    version: '0.2.0',
    notes: [
      'Introduced a Dune: Awakening-inspired dual theme system with a polished light and dark visual treatment across cards, controls, and navigation.',
      'Redesigned navigation with a stylized container and active-state gradients, plus a persistent theme toggle in the header for quick switching.',
      'Moved release notes out of the dashboard into a floating "Change Log" button that opens a compact update pop-up in the lower-right corner.',
      'Expanded admin roster controls so administrators can add members with handle/rank and edit name, handle, and rank directly from the table.',
      'Updated the product identity to The Black Templars Ledger with matching guild-specific header messaging.',
      'No database migration is required for this release.'
    ]
  },
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
