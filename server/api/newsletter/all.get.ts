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

  // Optional permission gate (if admin-only)
  if (await denies(event, readDashboard)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to view subscriptions."
      ),
    });
  }

  try {
    // Define Valibot schema for query validation
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
          transform((val) => (val ? Number(val) : 10)),
          number([minValue(1, t("Page size must be at least 1"))])
        )
      ),
      email: optional(string()), // email filter
    });

    const query = getQuery(event);
    const parsedQuery = parse(querySchema, query, { abortEarly: false });

    const { page = 1, pageSize = 10, email } = parsedQuery;
    const offset = (page - 1) * pageSize;

    const { DB } = event.context.cloudflare.env;
    const db = drizzle(DB);

    // Total count query
    let countQuery = db.select({ count: sql`COUNT(*)` }).from(newsletter);
    if (email) {
      countQuery = countQuery.where(sql`email LIKE ${`%${email}%`}`);
    }
    const totalResult = await countQuery;
    const total = Number(totalResult[0].count);

    // Fetch paginated records
    let selectQuery = db
      .select()
      .from(newsletter)
      .orderBy(newsletter.createdAt)
      .limit(pageSize)
      .offset(offset);

    if (email) {
      selectQuery = selectQuery.where(sql`email LIKE ${`%${email}%`}`);
    }

    const subscriptions = await selectQuery;

    return {
      total,
      page,
      pageSize,
      subscriptions,
    };
  } catch (error: any) {
    console.error("Error fetching newsletter subscriptions:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
