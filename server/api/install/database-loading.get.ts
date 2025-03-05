import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);
  
  try {
    const db: D1Database = event.context.cloudflare.env.DB;
    const drizzleDb = drizzle(db);

    // Check if the default Admin role exists
    const adminRole = await drizzleDb
      .select()
      .from(roles)
      .where(eq(roles.name, "Admin"))
      .get();

    // Create the Admin role with full permissions if it doesn't exist
    if (!adminRole) {
      const fullPermissions = [
        "dashboard.read",
        "dashboard.edit",
        "users.all",
        "users.edit",
        "users.delete",
        "roles.read",
        "roles.edit",
        "roles.delete",
        "item.create",
        "item.read",
        "item.edit",
        "item.delete",
        "page.create",
        "page.read",
        "page.edit",
        "page.delete",
        "media.upload",
        "media.read",
        "media.delete",
        "cdn.update",
        "config.manage",
      ];

      await drizzleDb
        .insert(roles)
        .values({
          name: "Admin",
          description: "Default admin role with full permissions.",
          permissions: JSON.stringify(fullPermissions),
        })
        .execute();
      console.log(t("Admin role created successfully."));
      return {
        dbConnected: true,
        message: t("The default admin role was created successfully."),
      };
    } else {
      console.log(t("Admin role already exists."));
      return {
        dbConnected: true,
        message: t("The default admin role is already configured."),
      };
    }
  } catch (error: any) {
    console.error(
      t("Error initializing default database data: ") + error.message
    );
    return {
      dbConnected: false,
      message:
        t("An error occurred while setting up default database data: ") +
        error.message,
    };
  }
});
