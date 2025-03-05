import type { D1Database } from "@cloudflare/workers-types";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";

function computeHash(data: string): string {
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
  const result = await db
    .prepare("SELECT hash FROM __drizzle_migrations")
    .all();
  return result && result.results
    ? result.results.map((row: any) => row.hash)
    : [];
}

async function applyMigration(db: D1Database, content: string) {
  if (!content.trim()) {
    throw new Error("Migration content is empty or malformed.");
  }

  // Split SQL by statement-breakpoints and semicolons, then filter empty strings
  const statements = content
    .split(/;|\-\-\> statement-breakpoint/)
    .map((stmt) => stmt.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      console.log("Executing SQL:", stmt);
      await db.prepare(stmt).run();
    } catch (error) {
      console.error("Error executing SQL statement:", stmt, error);
      throw error;
    }
  }
}

async function markMigrationAsApplied(db: D1Database, hash: string) {
  await db
    .prepare("INSERT INTO __drizzle_migrations (hash) VALUES (?)")
    .bind(hash)
    .run();
}

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const db: D1Database = event.context.cloudflare.env.DB;
  if (!db) {
    console.warn("No D1 database found in environment; skipping migrations.");
    return {
      status: "error",
      message: t("Database connection is not configured."),
    };
  }

  try {
    await ensureMigrationsTable(db);
    const appliedMigrations = await getAppliedMigrations(db);

    for (const migration of dbMigrations) {
      const hash = computeHash(migration.content);
      if (!appliedMigrations.includes(hash)) {
        await applyMigration(db, migration.content);
        await markMigrationAsApplied(db, hash);
        console.log(`Applied migration: ${migration.name}`);
      } else {
        console.log(`Skipping already applied migration: ${migration.name}`);
      }
    }

    console.log("All pending migrations applied successfully.");
    return {
      status: "success",
      message: t("All pending migrations applied successfully."),
    };
  } catch (error: any) {
    console.error("Automatic migration failed:", error);
    return {
      status: "error",
      message: t("Automatic migration failed."),
      error: error.message,
    };
  }
});
