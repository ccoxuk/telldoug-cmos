# Release Checklist (Staging → Prod)

This is the single source of truth for deploy gates. Do not skip steps.

## Pre-merge (PR)
- [ ] CI green on PR (CMOS CI)
- [ ] Review complete (no unresolved comments)
- [ ] Squash merge to `main`
- [ ] Delete branch

## Main branch (proof engine)
- [ ] CI green on `main`
- [ ] Branch protection enabled:
  - Require PR
  - Require CMOS CI
  - Require up-to-date branch
  - (Optional) Require linear history

## Staging (Railway project: telldoug-cmos-staging)
### Setup
- [ ] Create Railway project from `ccoxuk/telldoug-cmos` (branch: `main`)
- [ ] Add PostgreSQL
- [ ] App service env vars:
  - `AUTH_SECRET` (32+ bytes)
  - `FLOOT_DATABASE_URL` (Railway DATABASE_URL)
- [ ] Build: `npm ci && npm run build`
- [ ] Start: `npm run start`

### Migrate (one-off)
- [ ] Run `npm run migrate` (Railway → Run Command)

### Smoke (must pass)
- [ ] `GET /_api/health` returns `{ ok: true, ... }`
- [ ] Auth: register → login → session → logout
- [ ] Protected endpoint returns 401 when logged out
- [ ] CRUD: Institution, Job, Project, Skill, Person, Event, Relationship
- [ ] Dashboard onboarding: jobs=0 shows; after first job hides; `?new=1` opens dialog
- [ ] Timeline loads; year grouping works; no date crashes
- [ ] Global search scoped
- [ ] TellDoug: jobs, skills, 2022 queries scoped
- [ ] Import manual-only message
- [ ] AI endpoints return 410; AI UI unreachable

## Feature completion after staging smoke
- [ ] C2 Timeline filters (client-side, default Professional)
- [ ] C3 Dashboard “What’s New”
- [ ] Minimal tests updated (TellDoug patterns)

## Production (Railway project: telldoug-cmos-prod)
### Setup
- [ ] Separate Railway project + Postgres
- [ ] App service env vars:
  - `AUTH_SECRET` (new value)
  - `FLOOT_DATABASE_URL` (prod DB)

### Migrate (manual only)
- [ ] Run `npm run migrate` (one-off)

### Smoke (same as staging)
- [ ] Health, auth, CRUD, dashboard, timeline, search, TellDoug, MVP compliance

## Closeout
- [ ] Staging smoke green
- [ ] Prod smoke green
- [ ] README + EXECUTION.md reflect env.example.json + staging/prod + migrate discipline
