import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const now = new Date();

  try {
    // Ensure user is authenticated
    const session = await getUserSession(event);
    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        statusMessage: t("Unauthorized: User not authenticated"),
      });
    }
    const userId = session.user.id;

    // Read and validate input
    const { firstName, lastName, about } = await readBody(event);
    if (!firstName || !lastName || !about) {
      throw createError({
        statusCode: 400,
        statusMessage: t(
          "Missing required fields: firstName, lastName, or about"
        ),
      });
    }

    // Initialize the database connection
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Fetch user's roles and permissions
    const rolePermissions = await drizzleDb
      .select({ permissions: roles.permissions })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.roleId, roles.id))
      .where(eq(user_roles.userId, userId))
      .all();

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

    // Update the user profile and return the updated record
    const updatedUser = await drizzleDb
      .update(users)
      .set({
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        about,
        updatedAt: now,
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        displayName: users.displayName,
        avatar: users.avatar,
        email: users.email,
        about: users.about,
      })
      .execute();

    if (!updatedUser.length) {
      throw createError({
        statusCode: 500,
        statusMessage: t("Failed to update the user profile"),
      });
    }

    await replaceUserSession(event, {
      user: {
        id: updatedUser[0].id,
        username: updatedUser[0].username,
        displayName: updatedUser[0].displayName,
        pub: session.user.pub,
        permissions,
      },
      loggedInAt: now,
    });

    // Successful response with profile data
    return {
      message: t("Profile updated successfully"),
      firstName: updatedUser[0].firstName,
      lastName: updatedUser[0].lastName,
      displayName: updatedUser[0].displayName,
      about: updatedUser[0].about,
    };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || t("Internal Server Error. Please try again."),
    });
  }
});
