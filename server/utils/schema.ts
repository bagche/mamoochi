import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 🏢 Users Table
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

// 🔐 Roles Table (RBAC)
export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(), // Example: "admin", "editor", "subscriber"
  description: text("description").default(""),
});

// 🔑 User Roles (Many-to-Many Relationship)
export const user_roles = sqliteTable("user_roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  roleId: integer("role_id").notNull().references(() => roles.id),
});

// 📢 Blog Posts
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  status: text("status").default("draft"), // draft, published, archived
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// 🏷 Post Meta (Custom Metadata for Posts)
export const post_meta = sqliteTable("post_meta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull().references(() => posts.id),
  metaKey: text("meta_key").notNull(),
  metaValue: text("meta_value"),
});

// 💬 Comments
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").references(() => users.id), // Nullable for guest comments
  content: text("content").notNull(),
  status: text("status").default("pending"), // approved, spam, pending
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// 📂 Categories & Tags
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// 🏷 Post-Categories (Many-to-Many Relationship)
export const post_categories = sqliteTable("post_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull().references(() => posts.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
});

// 🏷 Post-Tags (Many-to-Many Relationship)
export const post_tags = sqliteTable("post_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull().references(() => posts.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
});

// 🛠 User Meta (Custom Metadata for Users)
export const user_meta = sqliteTable("user_meta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  metaKey: text("meta_key").notNull(),
  metaValue: text("meta_value"),
});

// 📊 Analytics & Logs
export const audit_logs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});

// ⚙️ Global Settings
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
});

// 🛡️ Sessions (for authentication)
export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
