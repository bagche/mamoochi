import { drizzle } from "drizzle-orm/d1";
import { desc, sql } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Get pagination parameters from query
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

    // Query the total count of comments
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(comments);
    const total = Number(totalResult[0].count);

    // Query paginated comments ordered by creation time descending
    const paginatedComments = await drizzleDb
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Optionally, if you experience circular reference issues:
    // const safeComments = JSON.parse(JSON.stringify(paginatedComments));

    return {
      total,
      page,
      pageSize,
      comments: paginatedComments,
    };
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
