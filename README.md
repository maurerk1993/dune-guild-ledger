# Dune Guild Ledger

Production-oriented Next.js + Supabase app for Dune: Awakening guild logistics.

## Features (MVP)
- Supabase Auth (email/password) with profile sync and role-based access (`member`, `admin`)
- Owed items/resources ledger with fulfillment requests
- Guild roster with customizable dynamic fields
- Contributions actions + per-user/global history
- Supabase RLS policies for access control
- Atreides-inspired dark sand/blue/gold UI
- Built-in app version + patch notes (Dashboard)

## Version
- `0.6.1`

## Assumptions
- Members can always read roster and contributions history.
- Ledger visibility defaults to `all` via `app_settings.member_ledger_scope`.
- Admin-only writes are enforced by both API checks and RLS.

## 1) Create GitHub repo and push code
```bash
git init
git remote add origin <your-github-repo-url>
git add .
git commit -m "feat: initial Dune Guild Ledger MVP"
git branch -M main
git push -u origin main
```

## 2) Create Supabase project
1. Create a new project in Supabase.
2. Copy:
   - Project URL
   - anon public key
   - service role key (server-only)

## 3) Run SQL migrations in Supabase (exact order)
Run SQL in Supabase SQL editor:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_profile_names_motd_and_contribution_log_snapshots.sql`
3. `supabase/migrations/0003_profiles_policy_hotfix.sql`
4. `supabase/migrations/0004_contribution_points_and_admin_log_delete.sql`
5. `supabase/migrations/0005_case_insensitive_admin_role_assignment.sql`

These migrations create all tables, constraints, indexes, triggers, helper functions, and RLS policies, then apply incremental feature/hotfix updates.

## 4) Configure Supabase Auth
In **Auth > URL Configuration**:
- Site URL:
  - Local: `http://localhost:3000`
  - Prod: your Vercel domain, e.g. `https://your-dune-ledger.vercel.app`
- Redirect URLs:
  - `http://localhost:3000/**`
  - `https://<your-vercel-project>.vercel.app/**`
  - `https://<your-custom-domain>/**` (if used)

Enable Email/Password provider in **Auth > Providers**.

## 5) Initial admin bootstrap (safest/simple approach)
Use SQL function promotion (recommended):
```sql
select public.promote_user_to_admin('your-email@example.com');
```
Steps:
1. Sign up first in the app so your `profiles` row exists.
2. Run the SQL above in Supabase SQL editor.
3. Re-login; you now have admin rights.

## 6) Local development
Recommended: Node 20 LTS.

```bash
cp .env.example .env.local
# fill env vars
npm install
npm run dev
```
Open `http://localhost:3000`.

## 7) Deploy to Vercel
1. Import this GitHub repo into Vercel.
2. Set env vars in Vercel Project Settings > Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_MEMBER_LEDGER_SCOPE` (optional; default `all`)
3. Deploy.
4. Re-check Supabase Auth URL config includes Vercel preview/prod domains.
5. Redeploy if env vars changed.

## 8) Troubleshooting
- **403/npm install blocked**: use an environment with npm registry access.
- **Auth redirects loop**: verify Site URL + Redirect URLs in Supabase.
- **RLS permission errors**: ensure user role is `admin` for write ops.
- **Server key leaks**: never prefix service role with `NEXT_PUBLIC_`.
- **Profile missing**: ensure auth signup happened; trigger creates `profiles` row.
- **Member can’t see expected ledger records**: check `app_settings.member_ledger_scope` value.

## SQL changes required from you
Yes — you must run all migration files in order (`0001` through `0005`) in your Supabase project. Without them, username/MOTD/admin-role features can fail or behave inconsistently.

## Beyond PR acceptance
After merging/deploying code, you must also:
1. Configure Supabase project + Auth URLs.
2. Run SQL migration(s).
3. Promote first admin via SQL function.
4. Add environment variables in Vercel.
