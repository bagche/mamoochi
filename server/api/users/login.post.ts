import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const { userName, password } = await readBody(event);

    // Validate input
    if (!userName || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: t("Missing required fields: userName, password"),
      });
    }

    // Find the user by username
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);
    const user = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, userName))
      .get();

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: t("Invalid username or password"),
      });
    }

    // Verify password using salt stored in DB.
    const isPasswordValid = await verifySaltPassword(
      user.password,
      password,
      user.salt
    );

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: t("Invalid username or password"),
      });
    }

    // Fetch user's roles and extract permissions.
    // Query the user_roles join with roles table.
    const rolePermissions = await drizzleDb
      .select({ permissions: roles.permissions })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.roleId, roles.id))
      .where(eq(user_roles.userId, user.id))
      .all();

    // Combine permissions from all roles.
    // Each role.permissions is assumed to be a JSON string (e.g. '["seeDashboard","AddItem","EditPage"]').
    const permissionsSet = new Set<string>();
    for (const role of rolePermissions) {
      try {
        const perms: string[] = JSON.parse(role.permissions);
        perms.forEach((p) => permissionsSet.add(p));
      } catch (err) {
        console.error("Error parsing permissions for role", role, err);
      }
    }
    const permissions = Array.from(permissionsSet);

    // Set user session including the permissions array.
    await setUserSession(event, {
      user: {
        id: user.id,
        username: userName,
        permissions,
      },
      loggedInAt: new Date(),
    });

    return {
      message: "Login successful",
    };
  } catch (error: any) {
    console.error("Error logging in user:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
