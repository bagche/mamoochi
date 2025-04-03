import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  try {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Get pagination parameters from query string
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

    // Query total count of comments
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(comments);
    const total = Number(totalResult[0].count);

    // Query paginated comments with author details
    const allComments = await drizzleDb
      .select({
        id: comments.id,
        routePath: comments.routePath,
        body: comments.body,
        status: comments.status,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorId: comments.authorId,
        authorUsername: users.username,
        authorDisplayName: users.displayName,
        authorAvatar: users.avatar,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .limit(pageSize)
      .offset(offset);

    return {
      total,
      page,
      pageSize,
      comments: allComments,
    };
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
