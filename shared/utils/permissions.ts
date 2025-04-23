export const corePermissions = [
  // Dashboard
  "dashboard.read",
  "dashboard.edit",
  // Users
  "users.read",
  "users.create",
  "users.edit",
  "users.delete",
  // Roles
  "roles.read",
  "roles.create",
  "roles.edit",
  "roles.delete",
  // Devices
  "devices.read",
  "devices.create",
  "devices.edit",
  "devices.delete",
  // Builds
  "builds.read",
  "builds.create",
  "builds.edit",
  "builds.delete",
  // Commits
  "commits.read",
  "commits.create",
  "commits.edit",
  "commits.delete",
  // Comments
  "comments.read",
  "comments.create",
  "comments.edit",
  "comments.delete",
];

export const ownerPermissions = {
  name: "owner",
  description: "Role with full administrative permissions",
  permissions: [
    // Dashboard
    "dashboard.read",
    "dashboard.edit",
    // Users
    "users.read",
    "users.create",
    "users.edit",
    "users.delete",
    // Roles
    "roles.read",
    "roles.create",
    "roles.edit",
    "roles.delete",
    // Devices
    "devices.read",
    "devices.create",
    "devices.edit",
    "devices.delete",
    // Builds
    "builds.read",
    "builds.create",
    "builds.edit",
    "builds.delete",
    // Commits
    "commits.read",
    "commits.create",
    "commits.edit",
    "commits.delete",
    // Comments
    "comments.read",
    "comments.create",
    "comments.edit",
    "comments.delete",
  ],
};
export const editorPermissions = {
  name: "editor",
  description: "Role with editing permissions for builds and comments",
  permissions: [
    // Dashboard
    "dashboard.read",
    // Builds
    "builds.read",
    "builds.create",
    // Commits
    "commits.read",
    "commits.create",
    "commits.edit",
    "commits.delete",
    // Comments
    "comments.read",
    "comments.create",
    "comments.edit",
    "comments.delete",
  ],
};
export const memberPermissions = {
  name: "member",
  description: "Role with basic commenting permissions",
  permissions: ["comments.create"],
};
