import { drizzle } from "drizzle-orm/d1";
import {
  array,
  integer,
  minLength,
  minValue,
  number,
  object,
  parse,
  pipe,
  regex,
  string,
} from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Define Valibot schema for body validation
  const schema = object({
    userId: pipe(
      number(),
      integer(t("User ID must be an integer")),
      minValue(1, t("User ID must be a positive integer"))
    ),
    roleIds: array(
      string([regex(/^\d+$/, t("Role ID must be a valid number"))]),
      [minLength(1, t("At least one role must be selected"))]
    ),
  });

  // Read and validate the body
  const body = await readBody(event);
  const parsed = parse(schema, body, { abortEarly: false });
  const { userId, roleIds } = parsed;

  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);

  // Insert each roleId into the user_roles table
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
