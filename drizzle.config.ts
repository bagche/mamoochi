import type { Config } from "drizzle-kit";
import fs from "fs";
import path from "path";

// Define the local database directory
const localDbDir = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/";

// Check if the directory exists before attempting to read it
let localDbUrl: string | null = null;
if (fs.existsSync(localDbDir)) {
  // Automatically find the SQLite file in the directory
  const localDbFile = fs
    .readdirSync(localDbDir)
    .find((file) => file.endsWith(".sqlite"));

  // Construct the full database URL
  if (localDbFile) {
    localDbUrl = path.join(localDbDir, localDbFile);
  }
}

// Handle missing database case
if (!localDbUrl) {
  console.warn(
    "⚠️ Warning: Local D1 database file not found. Ensure Miniflare has created the database."
  );
}

export default {
  dialect: "sqlite",
  schema: "./server/utils/schema.ts",
  out: "./migrations",
  breakpoints: true,
  dbCredentials: {
    url: localDbUrl ?? "",
  },
} satisfies Config;
