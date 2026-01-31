# Railway Production (telldoug-cmos-prod)

This is the canonical, repeatable production setup. Only proceed after staging smoke is green.

## Project creation
- New Project → Deploy from GitHub
- Repo: `ccoxuk/telldoug-cmos`
- Branch: `main`

## Database
- Add PostgreSQL in the project canvas
- Wait until it is healthy

## App service variables (prod)
- `AUTH_SECRET` = new strong random (32+ bytes, unique from staging)
- `FLOOT_DATABASE_URL` = Railway Postgres connection string (use Railway `DATABASE_URL`)

## Build/start
- Build: `npm ci && npm run build`
- Start: `npm run start`

## One-off migrate (required)
- Run Command: `npm run migrate`

## Verification
1. Automated: `npm run smoke:gate -- https://<prod-url>`
2. Manual: follow `docs/RELEASE_CHECKLIST.md` smoke section

## Custom domain (telldoug.navigategov.uk)
1. Railway → Project → Settings → Domains → Add Domain.
2. Enter: `telldoug.navigategov.uk`.
3. Railway will provide a target (CNAME or ALIAS). Use the exact target Railway shows.
4. In DNS:
   - If Railway provides a CNAME target, set:
     - `CNAME` record for `telldoug` → `<railway-target>`
   - If Railway provides an A/AAAA/ALIAS target, follow that instruction exactly.
5. Wait for DNS propagation, then verify:
   - `https://telldoug.navigategov.uk/_api/health` returns `{ ok: true, ... }`
   - `npm run smoke:gate -- https://telldoug.navigategov.uk`

## Rollback discipline
- If any prod smoke step fails: revert to the last known good commit and redeploy.
