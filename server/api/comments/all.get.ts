import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql";
import {
  minValue,
  number,
  object,
  optional,
  parse,
  pipe,
  string,
  transform,
} from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  try {
    // Define Valibot schema for query parameters
    const querySchema = object({
      page: optional(
        pipe(
          string(),
          transform((val) => (val ? Number(val) : 1)),
          number([minValue(1, t("Page must be at least 1"))])
        )
      ),
      pageSize: optional(
        pipe(
          string(),
          transform((val) => (val ? Number(val) : 5)),
          number([minValue(1, t("Page size must be at least 1"))])
        )
      ),
    });

    const query = getQuery(event);
    const parsedQuery = parse(querySchema, query, { abortEarly: false });

    const { page = 1, pageSize = 5 } = parsedQuery;
    const offset = (page - 1) * pageSize;

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

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
