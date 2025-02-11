import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Extract pagination query parameters (default page 1, pageSize 5)
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

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
