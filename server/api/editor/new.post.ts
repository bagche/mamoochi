import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  // Read and validate the incoming JSON payload.
  const body = await readBody(event);
  const schema = z.object({
    path: z.string(),
    body: z.string(),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.message,
    });
  }
  const { path, body: content } = parsed.data;

  // Retrieve the user session.
  const session = await getUserSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { DB } = event.context.cloudflare.env;
  const db = drizzle(DB);
  // Check if an edit record for the given path already exists.
  const existingEdit = await db
    .select()
    .from(edits)
    .where(eq(edits.path, path.startsWith("/") ? path.slice(1) : path))
    .get();

  if (existingEdit) {
    // Update the existing record: update updatedAt and body.
    await db
      .update(edits)
      .set({
        updatedAt: new Date(),
        body: content,
        path: path.startsWith("/") ? path.slice(1) : path,
      })
      .where(eq(edits.id, existingEdit.id))
      .execute();
    return { message: "Content updated successfully" };
  } else {
    // Insert a new edit record.
    await db
      .insert(edits)
      .values({
        createdAt: new Date(),
        author: session.user?.id,
        path: path.startsWith("/") ? path.slice(1) : path,
        type: "page",
        body: content,
      })
      .execute();
    return { message: "Content saved successfully" };
  }
});
