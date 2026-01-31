# Railway Staging (telldoug-cmos-staging)

This is the canonical, repeatable staging setup.

## Project creation
- New Project → Deploy from GitHub
- Repo: `ccoxuk/telldoug-cmos`
- Branch: `main`

## Database
- Add PostgreSQL in the project canvas
- Wait until it is healthy

## App service variables
- `AUTH_SECRET` = strong random (32+ bytes)
- `FLOOT_DATABASE_URL` = Railway Postgres connection string (use Railway `DATABASE_URL`)

## Build/start
- Build: `npm ci && npm run build`
- Start: `npm run start`

## One-off migrate (required)
- Run Command: `npm run migrate`

## Verification
1. Automated: `npm run smoke:gate -- https://<staging-url>`
2. Manual: follow `docs/RELEASE_CHECKLIST.md` smoke section
