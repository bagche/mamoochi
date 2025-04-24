import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql";
import {
  enum_,
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

  if (await denies(event, createComment)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to Read comments."
      ),
    });
  }

  try {
    // Define allowed status values
    const StatusEnum = enum_(["new", "published", "spam"]);

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
      status: optional(StatusEnum, undefined),
    });

    const query = getQuery(event);
    const parsedQuery = parse(querySchema, query, { abortEarly: false });
    const session = await getUserSession(event);
    const currentUserId = session?.user?.id ?? null;
    const { page = 1, pageSize = 5, status } = parsedQuery;
    const offset = (page - 1) * pageSize;

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Query total count of comments for the logged-in user
    let totalQuery = drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(comments)
      .where(eq(comments.authorId, currentUserId));
    if (status) {
      totalQuery = totalQuery.where(eq(comments.status, status));
    }
    const totalResult = await totalQuery;
    const total = Number(totalResult[0].count);

    // Query paginated comments for the logged-in user with author details
    let commentsQuery = drizzleDb
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
      .where(eq(comments.authorId, currentUserId))
      .limit(pageSize)
      .offset(offset);

    if (status) {
      commentsQuery = commentsQuery.where(eq(comments.status, status));
    }

    const userComments = await commentsQuery;

    return {
      total,
      page,
      pageSize,
      comments: userComments,
    };
  } catch (error: any) {
    console.error("Error fetching user comments:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
