import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Check permission: only allow if the user has editComment permission
  if (await denies(event, editComment)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to edit comments."
      ),
    });
  }

  try {
    // Read the body and validate required fields
    const { id, newStatus } = await readBody(event);
    if (!id || !newStatus) {
      throw createError({
        statusCode: 400,
        statusMessage: t("Missing required fields: id or newStatus"),
      });
    }

    // Validate newStatus is allowed
    const allowedStatuses = ["published", "spam", "draft"];
    if (!allowedStatuses.includes(newStatus)) {
      throw createError({
        statusCode: 400,
        statusMessage: t("Invalid status value."),
      });
    }

    // Initialize database connection
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);

    // Update the comment's status and update timestamp
    const result = await drizzleDb
      .update(comments)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, id))
      .returning({ id: comments.id, status: comments.status })
      .execute();

    if (!result.length) {
      throw createError({
        statusCode: 404,
        statusMessage: t("Comment not found."),
      });
    }

    return {
      success: true,
      message: t("Comment status updated successfully."),
      comment: result[0],
    };
  } catch (error: any) {
    console.error("Error updating comment status:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
