import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.userName || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: t(
          "Missing required fields: firstName, lastName, userName, or password"
        ),
      });
    }
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Check if the username is already registered
    const existingUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, body.userName))
      .get();

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: t(
          "Username is already taken. Please choose another one."
        ),
      });
    }

    // Generate a unique salt
    const salt = generateSalt();
    // Hash the password with the salt
    const hashedPassword = await hashSaltPassword(body.password, salt);

    // Insert the new user into the database
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

    // Retrieve the inserted user based on the unique `username`
    const insertedUser = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.username, body.userName))
      .get();

    if (!insertedUser) {
      throw createError({
        statusCode: 500,
        statusMessage: t("Failed to retrieve the newly created user"),
      });
    }

    // Set the user session with their workspace permissions
    await setUserSession(event, {
      user: {
        id: insertedUser.id,
        username: insertedUser.username,
        displayName: insertedUser.displayName ?? "",
      },
      loggedInAt: new Date(),
    });

    // Return success message
    return {
      message: t("Registered successfully"),
    };
  } catch (e: any) {
    console.error("Error creating user:", e);

    throw createError({
      statusCode: e.statusCode || 500,
      statusMessage:
        e.statusMessage || t("Internal Server Error. Please try again later."),
    });
  }
});
