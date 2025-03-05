import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const body = await readBody(event);

    // Validate that the username is provided
    if (!body.userName) {
      throw createError({
        statusCode: 400,
        statusMessage: t("Missing required field: userName"),
      });
    }

    const db: D1Database = event.context.env.DB;
    const drizzleDb = drizzle(db);

    // Look up the user by username
    const user = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, body.userName))
      .get();

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: t("User not found. Please verify the username."),
      });
    }

    // Retrieve the default "Admin" role from the roles table
    const adminRole = await drizzleDb
      .select()
      .from(roles)
      .where(eq(roles.name, "Admin"))
      .get();

    if (!adminRole) {
      throw createError({
        statusCode: 500,
        statusMessage: t(
          "Default Admin role is missing. Please complete the initial setup."
        ),
      });
    }

    // Check if the user is already assigned the Admin role
    const assignment = await drizzleDb
      .select()
      .from(user_roles)
      .where(eq(user_roles.userId, user.id))
      .where(eq(user_roles.roleId, adminRole.id))
      .get();

    if (assignment) {
      return {
        message: t("The user is already assigned to the Admin role."),
      };
    }

    // Assign the user to the Admin role by inserting into the join table
    await drizzleDb
      .insert(user_roles)
      .values({
        userId: user.id,
        roleId: adminRole.id,
      })
      .execute();

    return {
      message: t("User has been successfully assigned the Admin role."),
      user,
    };
  } catch (error: any) {
    console.error("Error assigning admin role:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        t(
          "An error occurred while assigning the Admin role. Please try again later."
        ),
    });
  }
});
