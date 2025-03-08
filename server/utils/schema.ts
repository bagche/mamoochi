import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ===================== Users =====================
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
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ===================== Roles ===================== (RBAC)
export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").default(""),
  permissions: text("permissions").notNull(), // JSON-encoded permissions array
});

// ===================== User Roles (M2M Relationship) =====================
export const user_roles = sqliteTable("user_roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id),
});

// ===================== Devices =====================
export const devices = sqliteTable("devices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  pubKey: text("pub_key").notNull(), // Public key or identifier
  ip: text("ip_address").default(""),
  deviceName: text("device_name").default(""),
  userAgent: text("user_agent").default(""),
  loginDate: integer("login_date", { mode: "timestamp" }).notNull(),
  lastActivity: integer("last_activity", { mode: "timestamp" }).notNull(),
});

// ===================== Builds =====================
export const builds = sqliteTable("builds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  buildName: text("build_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  status: text("status").default("pending"), // Example: pending, success, failed
});

// ===================== Commits (Previously Edits) =====================
export const commits = sqliteTable("commits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  buildId: integer("build_id")
    .notNull()
    .references(() => builds.id),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
  path: text("path").default(""),
  type: text("type").default(""),
  status: text("status").default(""),
  message: text("message").default(""),
  body: text("body").default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ===================== Comments =====================
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routePath: text("route_path").notNull(), // Path of the post or page
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
  parentCommentId: integer("parent_comment_id").references(() => comments.id), // For threaded replies, nullable
  body: text("body").notNull(),
  status: text("status").default("published"), // Example: published, hidden, deleted
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
