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

    // Read and validate query parameters
    const query = getQuery(event);
    const parsedQuery = parse(querySchema, query, { abortEarly: false });

    const { page = 1, pageSize = 5 } = parsedQuery;
    const offset = (page - 1) * pageSize;

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Get total count of roles
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(roles);
    const total = Number(totalResult[0].count);

    // Get paginated roles
    const allRoles = await drizzleDb
      .select()
      .from(roles)
      .limit(pageSize)
      .offset(offset);

    // Return the pagination meta and roles array
    return {
      total,
      page,
      pageSize,
      roles: allRoles,
    };
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
