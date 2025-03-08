import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const now = new Date();

  if (await denies(event, sendComment)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to post comments."
      ),
    });
  }
  const session = await getUserSession(event);

  // Retrieve the current session
  //   if (!session || !session.user) {
  //     throw createError({
  //       statusCode: 401,
  //       statusMessage: t("Unauthorized: Please log in to comment."),
  //     });
  //   }
  //   const user = session.user;

  //   // Check permission: user must have "comment.create" to post comments
  //   if (!user.permissions || !user.permissions.includes("comment.create")) {
  //     throw createError({
  //       statusCode: 403,
  //       statusMessage: t(
  //         "Forbidden: You do not have permission to post comments."
  //       ),
  //     });
  //   }

  // Read and validate request body. We expect:
  //   - routePath: string (the path of the content to which the comment belongs)
  //   - commentBody: string (the comment text)
  //   - parentCommentId (optional): number (for replies)
  const payload = await readBody(event);
  const { routePath, commentBody, parentCommentId } = payload;
  if (!routePath || !commentBody) {
    throw createError({
      statusCode: 400,
      statusMessage: t(
        "Missing required fields: routePath and commentBody are required."
      ),
    });
  }

  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);

  // Insert new comment into the database
  const insertedComment = await drizzleDb
    .insert(comments)
    .values({
      routePath: routePath,
      authorId: session.user.id,
      parentCommentId: parentCommentId || null,
      body: commentBody,
      status: "published",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return {
    message: t("Comment posted successfully."),
    comment: insertedComment,
  };
});
