import type { D1Database } from "@cloudflare/workers-types";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { array, minLength, object, parse, pipe, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  const db: D1Database = event.context.cloudflare.env.DB;
  const drizzleDb = drizzle(db);
  const appConfig = useAppConfig(event);

  // Check if app is installed
  if (appConfig.installed) {
    throw createError({
      statusCode: 403,
      message: t("Application is already installed"),
    });
  }

  // Define Valibot schema for role validation
  const RoleSchema = array(
    object({
      name: pipe(string(), minLength(1, t("Role name must not be empty"))),
      description: pipe(
        string(),
        minLength(1, t("Role description must not be empty"))
      ),
      permissions: array(string()),
    })
  );

  try {
    // Validate roles input (assuming rolesToCreate is provided or defined)
    const rolesToCreate = parse(RoleSchema, [
      ownerPermissions,
      editorPermissions,
      memberPermissions,
    ]);

    const results = [];

    // Process each role
    for (const role of rolesToCreate) {
      const existingRole = await drizzleDb
        .select()
        .from(roles)
        .where(eq(roles.name, role.name))
        .get();

      if (!existingRole) {
        await drizzleDb
          .insert(roles)
          .values({
            name: role.name,
            description: role.description,
            permissions: JSON.stringify(role.permissions),
          })
          .execute();
        results.push({
          role: role.name,
          message: t(`${role.name} role created successfully.`),
          created: true,
        });
      } else {
        results.push({
          role: role.name,
          message: t(`${role.name} role already exists.`),
          created: false,
        });
      }
    }

    return {
      dbConnected: true,
      results,
      message: t("Role initialization completed."),
    };
  } catch (error: any) {
    console.error("Error initializing default database roles:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message:
        t("Failed to initialize roles: ") +
        (error.message || t("Unknown error")),
    });
  }
});
