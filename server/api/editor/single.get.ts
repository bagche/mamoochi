import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  // Validate the "path" query parameter.
  const query = getQuery(event);
  const schema = z.object({
    path: z.string(),
  });
  const parsed = schema.safeParse(query);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid 'path' query parameter",
    });
  }
  const { path } = parsed.data;

  const { DB } = event.context.cloudflare.env;
  const db = drizzle(DB);

  // Look up the edit record matching the given path.
  const record = await db
    .select()
    .from(edits)
    .where(eq(edits.path, path))
    .get();
  return record || null;
});
