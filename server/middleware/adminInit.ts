import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  // console.log("New request: " + getRequestURL(event));
  if (event?.context?.cloudflare?.env) {
    const { DB } = event.context.cloudflare.env;
    const drizzleDb = drizzle(DB);
    // Check if the "Admin" role already exists.
    const adminRole = await drizzleDb
      .select()
      .from(roles)
      .where(eq(roles.name, "Admin"))
      .get();
    // If the "Admin" role does not exist, create it with full permissions.
    if (!adminRole) {
      const corePermissions = [
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
          description: "Full access admin role",
          permissions: JSON.stringify(corePermissions),
        })
        .execute();
      console.log("Admin role created successfully.");
    } else {
      // console.log("Admin role already exists.");
    }
  }
});
