import { Kysely, sql } from "kysely";

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

  await db.schema
    .createTable("jobs")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("company", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("start_date", "timestamptz")
    .addColumn("end_date", "timestamptz")
    .addColumn("is_current", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("location", "text")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("projects")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("start_date", "timestamptz")
    .addColumn("end_date", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();


  await db.schema
    .createTable("people")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("role", "text")
    .addColumn("company", "text")
    .addColumn("email", "text")
    .addColumn("relationship_type", "text")
    .addColumn("last_contacted_at", "timestamptz")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("events")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("event_date", "timestamptz")
    .addColumn("event_end_date", "timestamptz")
    .addColumn("event_type", "text", (col) => col.notNull())
    .addColumn("location", "text")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("relationships")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("source_id", "text", (col) => col.notNull())
    .addColumn("source_type", "text", (col) => col.notNull())
    .addColumn("target_id", "text", (col) => col.notNull())
    .addColumn("target_type", "text", (col) => col.notNull())
    .addColumn("relationship_label", "text", (col) => col.notNull())
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("institutions")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("degree", "text")
    .addColumn("field_of_study", "text")
    .addColumn("location", "text")
    .addColumn("start_date", "timestamptz")
    .addColumn("end_date", "timestamptz")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("learning")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("learning_type", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("start_date", "timestamptz")
    .addColumn("completion_date", "timestamptz")
    .addColumn("provider", "text")
    .addColumn("cost", "numeric")
    .addColumn("skills_gained", "text")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("feedback")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("person_id", "text", (col) => col.notNull())
    .addColumn("feedback_date", "timestamptz", (col) => col.notNull())
    .addColumn("feedback_type", "text", (col) => col.notNull())
    .addColumn("context", "text")
    .addColumn("notes", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("goals")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("target_date", "timestamptz", (col) => col.notNull())
    .addColumn("goal_type", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("interactions")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("person_id", "text", (col) => col.notNull())
    .addColumn("project_id", "text")
    .addColumn("interaction_date", "timestamptz", (col) => col.notNull())
    .addColumn("interaction_type", "text", (col) => col.notNull())
    .addColumn("tags", "text")
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("content")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("content_type", "text", (col) => col.notNull())
    .addColumn("publication_date", "timestamptz", (col) => col.notNull())
    .addColumn("platform", "text")
    .addColumn("url", "text")
    .addColumn("description", "text")
    .addColumn("engagement_metrics", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("compensation")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("job_id", "text", (col) => col.notNull())
    .addColumn("effective_date", "timestamptz", (col) => col.notNull())
    .addColumn("base_salary", "numeric", (col) => col.notNull())
    .addColumn("currency", "text", (col) => col.notNull().defaultTo("GBP"))
    .addColumn("bonus", "numeric")
    .addColumn("equity_value", "numeric")
    .addColumn("benefits_note", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("achievements")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("achieved_date", "timestamptz", (col) => col.notNull())
    .addColumn("category", "text", (col) => col.notNull())
    .addColumn("quantifiable_impact", "text")
    .addColumn("evidence_url", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("skills")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("category", "text")
    .addColumn("proficiency", "text", (col) => col.notNull())
    .addColumn("notes", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("skills").ifExists().execute();
  await db.schema.dropTable("achievements").ifExists().execute();
  await db.schema.dropTable("compensation").ifExists().execute();
  await db.schema.dropTable("content").ifExists().execute();
  await db.schema.dropTable("interactions").ifExists().execute();
  await db.schema.dropTable("goals").ifExists().execute();
  await db.schema.dropTable("feedback").ifExists().execute();
  await db.schema.dropTable("learning").ifExists().execute();
  await db.schema.dropTable("institutions").ifExists().execute();
  await db.schema.dropTable("relationships").ifExists().execute();
  await db.schema.dropTable("events").ifExists().execute();
  await db.schema.dropTable("people").ifExists().execute();
  await db.schema.dropTable("projects").ifExists().execute();
  await db.schema.dropTable("jobs").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();
}
