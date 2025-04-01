import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const now = new Date();

  if (await denies(event, createComment)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to post comments."
      ),
    });
  }

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

  const session = await getUserSession(event);
  // Insert new comment into the database
  const insertedComment = await drizzleDb
    .insert(comments)
    .values({
      routePath: routePath,
      authorId: session.user.id,
      parentCommentId: parentCommentId || null,
      body: commentBody,
      status: CommentStatus.Draft,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return {
    message: t("Comment posted successfully."),
    comment: insertedComment,
  };
});
