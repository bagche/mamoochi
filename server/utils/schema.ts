import { integer,sqliteTable, text } from "drizzle-orm/sqlite-core";



// Users Table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  displayName: text("displayName").default(""),
  about: text("about").default(""),
  email: text("email").unique(),
  avatar: text("avatar").default(""),
  password: text("password").notNull(),
  salt: text("salt").notNull(), 
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
},  (t) => []
);

