import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const body = await readBody(event);

  // Validate incoming payload: expects a numeric userId and a non-empty array of role IDs (as strings)
  const schema = z.object({
    userId: z.number(),
    roleIds: z
      .array(z.string())
      .min(1, t("At least one role must be selected")),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.message,
    });
  }
  const { userId, roleIds } = parsed.data;

  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);

  // For each roleId, insert a record into the user_roles table.
  // Note: Role IDs come as strings; convert them to numbers.
  for (const roleIdStr of roleIds) {
    const roleId = parseInt(roleIdStr, 10);
    await drizzleDb
      .insert(user_roles)
      .values({
        userId,
        roleId,
      })
      .execute();
  }

  return {
    message: t("Roles added successfully"),
  };
});
