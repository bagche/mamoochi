import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, parse, string } from "valibot";

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

    // Define Valibot schema for body validation
    const schema = object({
      firstName: string([minLength(1, t("First name must not be empty"))]),
      lastName: string([minLength(1, t("Last name must not be empty"))]),
      about: string([minLength(1, t("About must not be empty"))]),
    });

    // Read and validate the body
    const body = await readBody(event);
    const parsed = parse(schema, body, { abortEarly: false });
    const { firstName, lastName, about } = parsed;

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
