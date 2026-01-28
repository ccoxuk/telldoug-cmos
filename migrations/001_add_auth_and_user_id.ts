import { Kysely, sql } from "kysely";

const USER_TABLES = [
  "achievements",
  "compensation",
  "content",
  "events",
  "feedback",
  "goals",
  "institutions",
  "interactions",
  "jobs",
  "learning",
  "people",
  "projects",
  "relationships",
  "skills",
];

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("password_hash", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  for (const table of USER_TABLES) {
    await sql`alter table ${sql.table(table)} add column if not exists user_id text`.execute(db);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  for (const table of USER_TABLES) {
    await db.schema.alterTable(table).dropColumn("user_id").execute();
  }

  await db.schema.dropTable("users").execute();
}
