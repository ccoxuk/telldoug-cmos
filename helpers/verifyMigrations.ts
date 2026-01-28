import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "./db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationFolder = path.join(__dirname, "..", "migrations");

async function run() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  const migrations = await migrator.getMigrations();
  const pending = migrations.filter((m) => !m.executedAt);

  if (pending.length > 0) {
    console.error("Pending migrations:");
    pending.forEach((m) => console.error(`- ${m.name}`));
    await db.destroy();
    process.exit(1);
  }

  console.log("All migrations have been applied.");
  await db.destroy();
}

run().catch((error) => {
  console.error("Migration verification failed", error);
  process.exit(1);
});
