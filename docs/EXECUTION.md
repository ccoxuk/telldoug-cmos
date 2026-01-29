# Execution Rules (TellDoug MVP)

## Canonical App Root
- repository root

## Required Commands (in order)
Run from repo root:
1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. `npm run migrate`
6. `npm run dev`

## Required Environment Variables (MVP)
- `AUTH_SECRET`
- `FLOOT_DATABASE_URL`

Post‑MVP only (do not require for MVP builds):
- `OPENAI_API_KEY`

## Local env setup
Copy the example file, then fill in values:
```
cp env.example.json env.json
```
`env.json` is local‑only and must not be committed.

## Required Smoke Steps
- register → login → session → logout
- create: Institution, Job, Project, Skill, Person, Event, Relationship
- verify list pages are user‑scoped
- timeline loads and displays the above
- global search works and is user‑scoped
- TellDoug responds to:
  - “show my jobs”
  - “show my skills”
  - “what did I do in 2022”
- import page shows manual‑only MVP message
- AI endpoints return 410 and AI UI is not reachable

## Definition of Done (MVP)
- CI green (install/typecheck/lint/build/migrate)
- privacy tests pass (no cross‑user leakage)
- pilot user can enter 5 years without errors
- timeline shows gaps/patterns
- TellDoug answers 3 deterministic queries
- AI/import disabled cleanly
- deployed smoke passes
