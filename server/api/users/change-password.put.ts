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
      oldPassword: string([
        minLength(1, t("Current password must not be empty")),
      ]),
      newPassword: string([minLength(1, t("New password must not be empty"))]),
    });

    // Read and validate the body
    const body = await readBody(event);
    const parsed = parse(schema, body, { abortEarly: false });
    const { oldPassword, newPassword } = parsed;

    // Initialize DB from Cloudflare environment
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Fetch user record (only need the password field)
    const user = await drizzleDb
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: t("User not found"),
      });
    }

    // Verify that the provided old password is correct
    const isValidPassword = await verifyWorkerPassword(
      oldPassword,
      user.password
    );
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: t("Current password is incorrect"),
      });
    }

    // Hash the new password using the worker's hashing method
    const hashedNewPassword = await hashWorkerPassword(newPassword);

    // Update the user's password and updatedAt timestamp
    await drizzleDb
      .update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: now,
      })
      .where(eq(users.id, userId))
      .execute();

    return { success: true, message: t("Password changed successfully") };
  } catch (error: any) {
    console.error("Error changing password:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        t("Internal Server Error. Please try again later."),
    });
  }
});
