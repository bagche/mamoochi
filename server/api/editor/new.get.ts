import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Get pagination parameters from the query string.
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

    // Query the total count of edit records.
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(edits);
    const total = Number(totalResult[0].count);

    // Query paginated edit records ordered by createdAt descending.
    const allEdits = await drizzleDb
      .select()
      .from(edits)
      .orderBy(edits.createdAt, "desc")
      .limit(pageSize)
      .offset(offset);

    return {
      total,
      page,
      pageSize,
      edits: allEdits,
    };
  } catch (error: any) {
    console.error("Error fetching edits:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
