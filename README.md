# TellDoug CMOS (MVP)

TellDoug is a privacy-first, single-user career OS. It consolidates jobs, projects, skills, people, institutions, and events into a structured, queryable system with a timeline and deterministic “TellDoug” queries.

For security reasons, `env.json` is not committed. Start by copying the example file:  

```
cp env.example.json env.json
```

Then fill in the values locally. `env.json` must never be committed.  

For **JWT/Auth secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field (for example, `AUTH_SECRET` in `env.json`).  

For the **Floot Database**, download your database content as a pg_dump from the cog icon in the database view (right pane -> data -> floot data base -> cog icon on the left of the name), upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

## MVP Environment Variables (required)

- `AUTH_SECRET`
- `FLOOT_DATABASE_URL`

## Post‑MVP (optional)

- `OPENAI_API_KEY` (only if AI features are re-enabled post‑MVP)

## MVP behavior
- AI and import endpoints are intentionally disabled (return 410).
- Migrations are run manually (never on boot).

## Local build/run
```
npm ci
npm run build
npm run start
```

## Migrations (manual)
```
npm run migrate
```

## Smoke check
```
npm run smoke:curl -- https://<your-url>
```

## Full smoke gate (auth + curl + CRUD)
```
npm run smoke:full -- https://<your-url>
```
