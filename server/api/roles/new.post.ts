import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import {
  array,
  maxLength,
  minLength,
  object,
  optional,
  parse,
  string,
} from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Define Valibot schema for validating the incoming payload
  const schema = object({
    roleName: string([
      minLength(3, t("Role name must be at least 3 characters")),
      maxLength(255, t("Role name must not exceed 255 characters")),
    ]),
    description: optional(
      string([
        maxLength(1000, t("Description must not exceed 1000 characters")),
      ])
    ),
    permissions: array(
      string([minLength(1, t("Permission must not be empty"))]),
      [minLength(1, t("At least one permission must be selected"))]
    ),
  });

  // Read and validate the body
  const body = await readBody(event);
  const parsed = parse(schema, body, { abortEarly: false });
  const { roleName, description, permissions } = parsed;

  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);

  // Check if the role name is already registered
  const existingRole = await drizzleDb
    .select()
    .from(roles)
    .where(eq(roles.name, roleName))
    .get();

  if (existingRole) {
    throw createError({
      statusCode: 409,
      statusMessage: t(
        "Role name is already taken. Please choose another one."
      ),
    });
  }

  // Insert the new role into the database
  await drizzleDb
    .insert(roles)
    .values({
      name: roleName,
      description: description || "",
      permissions: JSON.stringify(permissions),
    })
    .execute();

  return {
    message: t("Role added successfully"),
  };
});
