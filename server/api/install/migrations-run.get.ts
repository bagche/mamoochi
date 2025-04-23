import type { D1Database } from "@cloudflare/workers-types";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex } from "@noble/hashes/utils";
import { array, minLength, object, parse, pipe, string } from "valibot";

async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBytes = sha256(encoder.encode(data));
  return bytesToHex(hashBytes);
}

async function ensureMigrationsTable(db: D1Database) {
  // Use a single-line string without a trailing semicolon.
  await db.exec(
    "CREATE TABLE IF NOT EXISTS __drizzle_migrations (id INTEGER PRIMARY KEY, hash TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  );
}

async function getAppliedMigrations(db: D1Database): Promise<string[]> {
  const { results } = await db
    .prepare("SELECT hash FROM __drizzle_migrations")
    .all();
  return results ? results.map((row: any) => row.hash) : [];
}

async function applyMigration(db: D1Database, content: string): Promise<void> {
  if (!content.trim()) {
    throw new Error("Migration content is empty or malformed.");
  }

  const statements = content
    .split(/;|\-\-\> statement-breakpoint/)
    .map((stmt) => stmt.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      await db.prepare(stmt).run();
    } catch (error) {
      console.error("Error executing SQL statement:", stmt, error);
      throw error;
    }
  }
}

async function markMigrationAsApplied(
  db: D1Database,
  hash: string
): Promise<void> {
  await db
    .prepare("INSERT INTO __drizzle_migrations (hash) VALUES (?)")
    .bind(hash)
    .run();
}

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const db: D1Database = event.context.cloudflare.env.DB;
  const appConfig = useAppConfig(event);

  // Check if app is installed
  if (appConfig.installed) {
    throw createError({
      statusCode: 403,
      message: t("Application is already installed"),
    });
  }

  // Define Valibot schema for migrations
  const MigrationSchema = array(
    object({
      name: pipe(string(), minLength(1, t("Migration name must not be empty"))),
      content: pipe(
        string(),
        minLength(1, t("Migration content must not be empty"))
      ),
    })
  );

  if (!db) {
    console.warn("No D1 database found in environment; skipping migrations.");
    throw createError({
      statusCode: 500,
      message: t("Database connection is not configured."),
    });
  }

  try {
    // Validate migrations
    const migrations = parse(MigrationSchema, dbMigrations);

    await ensureMigrationsTable(db);
    const appliedMigrations = await getAppliedMigrations(db);

    for (const migration of migrations) {
      const hash = await computeHash(migration.content);
      if (!appliedMigrations.includes(hash)) {
        await applyMigration(db, migration.content);
        await markMigrationAsApplied(db, hash);
        console.log(`Applied migration: ${migration.name}`);
      } else {
        console.log(`Skipping already applied migration: ${migration.name}`);
      }
    }

    return {
      status: "success",
      message: t("All pending migrations applied successfully."),
    };
  } catch (error: any) {
    console.error("Automatic migration failed:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message:
        t("Automatic migration failed: ") +
        (error.message || t("Unknown error")),
    });
  }
});
