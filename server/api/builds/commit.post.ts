import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { minLength, object, parse, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Check that the user has permission to create a commit
  if (await denies(event, createCommit)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to create commits."
      ),
    });
  }

  // Validate incoming payload
  const body = await readBody(event);
  const schema = object({
    path: string([minLength(1, t("Path must not be empty"))]),
    body: string([minLength(1, t("Content must not be empty"))]),
  });
  const parsed = parse(schema, body, { abortEarly: false });
  const { path, body: content } = parsed;

  // Retrieve the current user session
  const session = await getUserSession(event);
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: t("Unauthorized"),
    });
  }
  const userId = session.user.id;

  // Initialize database connection
  const { DB } = event.context.cloudflare.env;
  const db = drizzle(DB);

  // Check if there is an existing build with status "new"
  const existingBuild = await db
    .select()
    .from(builds)
    .where(eq(builds.status, "new"))
    .get();

  let buildId: number;
  if (existingBuild) {
    buildId = existingBuild.id;
  } else {
    // Create a new build
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    // Format as "YYYY-MM-DD HH:mm"
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const buildInsertResult = await db
      .insert(builds)
      .values({
        buildName: formattedDate,
        createdAt: now,
        status: "new",
      })
      .returning({ id: builds.id });

    if (buildInsertResult.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: t("Failed to create a new build"),
      });
    }
    buildId = buildInsertResult[0].id;
  }

  // Sanitize path (remove leading "/" if exists)
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;

  // Check if there's already a commit for this path in the current build using the AND condition
  const existingCommit = await db
    .select()
    .from(commits)
    .where(and(eq(commits.buildId, buildId), eq(commits.path, sanitizedPath)))
    .get();

  if (existingCommit) {
    // Update the existing commit with new content and updatedAt
    await db
      .update(commits)
      .set({
        body: content,
        updatedAt: new Date(),
      })
      .where(eq(commits.id, existingCommit.id))
      .execute();
    return {
      message: t("Commit updated successfully"),
      commitId: existingCommit.id,
    };
  }

  // Insert new commit record if not exists
  const commitInsertResult = await db
    .insert(commits)
    .values({
      buildId,
      authorId: userId,
      path: sanitizedPath,
      message: path, // Using the file path as the commit message
      body: content,
      createdAt: new Date(),
    })
    .returning({ id: commits.id });

  if (commitInsertResult.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: t("Failed to create commit"),
    });
  }

  return {
    message: t("Commit created successfully"),
    commitId: commitInsertResult[0].id,
  };
});
