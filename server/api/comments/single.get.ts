import { and, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { desc, sql } from "drizzle-orm/sql";
import {
  maxValue,
  minLength,
  minValue,
  number,
  object,
  parse,
  pipe,
  string,
  transform,
} from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Define a Valibot schema for validating query parameters
  const schema = object({
    page: pipe(
      string(),
      transform((val) => Number(val)),
      number(),
      minValue(1, t("Invalid page parameter: must be a number >= 1"))
    ),
    pageSize: pipe(
      string(),
      transform((val) => Number(val)),
      number(),
      minValue(
        1,
        t("Invalid pageSize parameter: must be a number between 1 and 100")
      ),
      maxValue(
        100,
        t("Invalid pageSize parameter: must be a number between 1 and 100")
      )
    ),
    path: pipe(string(), minLength(1, t("Missing or invalid path parameter"))),
  });

  // Parse query parameters
  const query = getQuery(event);
  const parsed = parse(schema, query, { abortEarly: false });

  try {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Extract validated parameters
    const { page, pageSize, path } = parsed;
    const offset = (page - 1) * pageSize;

    // Retrieve current user session (if any)
    const session = await getUserSession(event);
    const currentUserId = session?.user?.id ?? null;

    // Build the where condition
    const whereCondition = currentUserId
      ? and(
          eq(comments.routePath, path),
          or(
            eq(comments.status, "published"),
            eq(comments.authorId, currentUserId)
          )
        )
      : and(eq(comments.routePath, path), eq(comments.status, "published"));

    // Query the total count of comments
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(comments)
      .where(whereCondition);
    const total = Number(totalResult[0].count);

    // Query paginated comments
    const paginatedComments = await drizzleDb
      .select({
        author: {
          id: users.id,
          displayName: users.displayName,
          avatar: users.avatar,
        },
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        status: comments.status,
        id: comments.id,
        parentCommentId: comments.parentCommentId,
        body: comments.body,
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.authorId))
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
