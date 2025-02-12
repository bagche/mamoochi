import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql"; // Import SQL helper if needed for count queries

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

    // Query the total count of users
    const totalResult = await drizzleDb
      .select({ count: sql`COUNT(*)` })
      .from(users);
    const total = Number(totalResult[0].count);

    // Query paginated users
    const allUsers = await drizzleDb
      .select()
      .from(users)
      .limit(pageSize)
      .offset(offset);

    // Remove sensitive fields such as password and salt
    const safeUsers = allUsers.map(({ password, salt, ...user }) => user);

    return {
      total,
      page,
      pageSize,
      users: safeUsers,
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
