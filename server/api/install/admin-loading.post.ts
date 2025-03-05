import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const body = await readBody(event);

    // Validate that all required admin details are provided
    if (!body.firstName || !body.lastName || !body.userName || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: t(
          "Please provide firstName, lastName, userName, and password."
        ),
      });
    }

    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Check if the username already exists
    const existingUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, body.userName))
      .get();

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: t(
          "This username is already in use. Please choose another."
        ),
      });
    }

    // Generate a salt and hash the provided password
    const salt = generateSalt();
    const hashedPassword = await hashSaltPassword(body.password, salt);

    // Create the new admin user
    await drizzleDb
      .insert(users)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        displayName: `${body.firstName} ${body.lastName}`,
        about: body.about || "",
        avatar: body.avatar || "",
        username: body.userName,
        password: hashedPassword,
        salt,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })
      .execute();

    // Retrieve the newly created user
    const insertedUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, body.userName))
      .get();

    if (!insertedUser) {
      throw createError({
        statusCode: 500,
        statusMessage: t("Failed to retrieve the newly created user."),
      });
    }

    // Retrieve the default Admin role (which should already be configured)
    const adminRole = await drizzleDb
      .select()
      .from(roles)
      .where(eq(roles.name, "Admin"))
      .get();

    if (!adminRole) {
      throw createError({
        statusCode: 500,
        statusMessage: t("The Admin role is not configured in the system."),
      });
    }

    // Associate the new user with the Admin role
    await drizzleDb
      .insert(user_roles)
      .values({
        userId: insertedUser.id,
        roleId: adminRole.id,
      })
      .execute();

    // Establish the user session with the new admin's details
    await setUserSession(event, {
      user: {
        id: insertedUser.id,
        username: insertedUser.username,
        firstName: insertedUser.firstName,
        lastName: insertedUser.lastName,
        displayName: insertedUser.displayName ?? "",
        avatar: insertedUser.avatar || "",
        email: insertedUser.email || "",
        about: insertedUser.about || "",
      },
      loggedInAt: new Date(),
    });

    return {
      message: t("Admin user registered and loaded successfully."),
    };
  } catch (error: any) {
    console.error("Error during admin user registration:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        t("An unexpected error occurred. Please try again later."),
    });
  }
});
