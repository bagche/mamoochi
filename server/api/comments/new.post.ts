import { drizzle } from "drizzle-orm/d1";
import {
  integer,
  minLength,
  minValue,
  nullable,
  number,
  object,
  optional,
  parse,
  string,
} from "valibot";

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

  // Define Valibot schema for body validation
  const schema = object({
    routePath: string([minLength(1, t("Route path must not be empty"))]),
    commentBody: string([minLength(1, t("Comment body must not be empty"))]),
    parentCommentId: optional(
      nullable(
        number([
          integer(),
          minValue(1, t("Parent comment ID must be a positive integer")),
        ])
      )
    ),
  });

  // Read and validate the body
  const payload = await readBody(event);
  const parsed = parse(schema, payload, { abortEarly: false });

  const { routePath, commentBody, parentCommentId } = parsed;

  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);

  const session = await getUserSession(event);
  // Insert new comment into the database
  const insertedComment = await drizzleDb
    .insert(comments)
    .values({
      routePath,
      authorId: session.user.id,
      parentCommentId: parentCommentId || null,
      body: commentBody,
      status: CommentStatus.New,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return {
    message: t("Comment posted successfully."),
    comment: insertedComment,
  };
});
