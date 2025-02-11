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

    // Verify password
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

    // Set user session
    await setUserSession(event, {
      user: {
        id: user.id,
        username: userName,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName ?? "",
        avatar: user.avatar || "",
        email: user.email || "",
        about: user.about || "",
      },
      loggedInAt: Date.now(),
    });

    // Return user information
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