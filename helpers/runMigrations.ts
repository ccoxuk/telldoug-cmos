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

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`Migration "${it.migrationName}" ran successfully`);
    } else if (it.status === "Error") {
      console.error(`Migration "${it.migrationName}" failed`);
    }
  });

  if (error) {
    console.error("Migration failed", error);
    process.exit(1);
  }

  await db.destroy();
}

run().catch((error) => {
  console.error("Migration runner failed", error);
  process.exit(1);
});
