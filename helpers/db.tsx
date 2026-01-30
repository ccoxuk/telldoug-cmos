import { type GeneratedAlways, Kysely, CamelCasePlugin } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import { DB } from './schema'
import postgres from 'postgres'

const databaseUrl = process.env.FLOOT_DATABASE_URL ?? process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("FLOOT_DATABASE_URL or DATABASE_URL is not set")
}

export const db = new Kysely<DB>({
plugins: [new CamelCasePlugin()],
dialect: new PostgresJSDialect({
postgres: postgres(databaseUrl, {
prepare: false,
idle_timeout: 10,
max: 3,
}),
}),
})
