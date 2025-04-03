import { and, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { desc, sql } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  try {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Extract pagination parameters and path filter from the query string
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 5;
    const offset = (page - 1) * pageSize;
    const path = query.path as string;

    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: t("Missing required parameter: path"),
      });
    }

    // Retrieve current user session (if any)
    const session = await getUserSession(event);
    const currentUserId = session && session.user ? session.user.id : null;

    // Build the where condition:
    // Always require the comment's routePath to match the provided path.
    // If a user is logged in, include comments that are either published OR authored by that user.
    // Otherwise, only include published comments.
    const whereCondition = currentUserId
      ? and(
          eq(comments.routePath, path),
          or(
            eq(comments.status, "published"),
            eq(comments.authorId, currentUserId)
          )
        )
      : and(eq(comments.routePath, path), eq(comments.status, "published"));

    // Query the total count of comments matching our condition
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(comments)
      .where(whereCondition);
    const total = Number(totalResult[0].count);

    // Query paginated comments matching our condition, ordered by creation time descending
    const paginatedComments = await drizzleDb
      .select()
      .from(comments)
      .where(whereCondition)
      .orderBy(desc(comments.createdAt))
      .limit(pageSize)
      .offset(offset);

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
