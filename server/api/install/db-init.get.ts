import type { D1Database } from "@cloudflare/workers-types";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const d1: D1Database = event.context.env.DB;

  try {
    const checkTable = await d1
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`
      )
      .all();

    if (!checkTable || !checkTable.results.length) {
      const migrationSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          displayName TEXT DEFAULT '',
          about TEXT DEFAULT '',
          email TEXT UNIQUE,
          avatar TEXT DEFAULT '',
          password TEXT NOT NULL,
          salt TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          last_login_at INTEGER,
          updated_at INTEGER
        );
        CREATE TABLE IF NOT EXISTS roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT DEFAULT '',
          permissions TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS user_roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          role_id INTEGER NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id),
          FOREIGN KEY(role_id) REFERENCES roles(id)
        );
        CREATE TABLE IF NOT EXISTS edits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER,
          author_id INTEGER NOT NULL,
          path TEXT DEFAULT '',
          type TEXT DEFAULT '',
          status TEXT DEFAULT '',
          description TEXT DEFAULT '',
          FOREIGN KEY(author_id) REFERENCES users(id)
        );
      `;
      await d1.prepare(migrationSQL).run();
      // Check if the "Admin" role already exists.
      //       const adminRole = await drizzleDb
      //         .select()
      //         .from(roles)
      //         .where(eq(roles.name, "Admin"))
      //         .get();
      //       // If the "Admin" role does not exist, create it with full permissions.
      //       if (!adminRole) {
      //         const corePermissions = [
      //           "dashboard.read",
      //           "dashboard.edit",
      //           "users.all",
      //           "users.edit",
      //           "users.delete",
      //           "roles.read",
      //           "roles.edit",
      //           "roles.delete",
      //           "item.create",
      //           "item.read",
      //           "item.edit",
      //           "item.delete",
      //           "page.create",
      //           "page.read",
      //           "page.edit",
      //           "page.delete",
      //           "media.upload",
      //           "media.read",
      //           "media.delete",
      //           "cdn.update",
      //           "config.manage",
      //         ];
      //         await drizzleDb
      //           .insert(roles)
      //           .values({
      //             name: "Admin",
      //             description: "Full access admin role",
      //             permissions: JSON.stringify(corePermissions),
      //           })
      //           .execute();
      //         console.log("Admin role created successfully.");
    }

    return {
      success: true,
      message: "Database schema initialized successfully.",
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
});
