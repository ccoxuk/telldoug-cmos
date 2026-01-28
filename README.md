# Career Management Operating System
        
I want to build TellDoug, a career OS where a user can track their people, skills, jobs, projects, institutions, and events in one place with a timeline and an AI panel to query their data.

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

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

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
