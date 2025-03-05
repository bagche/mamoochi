import type { D1Database } from "@cloudflare/workers-types";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const d1: D1Database = event.context.cloudflare.env.DB;

  try {
    // Perform a simple query to verify that the database connection is working.
    const result = await d1.prepare("SELECT 1 as result").all();

    const connected = Boolean(
      result && result.results && result.results.length > 0
    );
    return {
      dbConnected: connected,
      message: connected
        ? t("Database connection is working.")
        : t("Database connection is not working."),
    };
  } catch (error: any) {
    return {
      dbConnected: false,
      message: t("Error checking database connection: ") + error.message,
    };
  }
});
