// Dashboard Abilities
export const readDashboard = defineAbility(
  (user: any) => user?.permissions?.includes("dashboard.read") ?? false
);
export const editDashboard = defineAbility(
  (user: any) => user?.permissions?.includes("dashboard.edit") ?? false
);

// Users Abilities
export const readUser = defineAbility(
  (user: any) => user?.permissions?.includes("users.read") ?? false
);
export const createUser = defineAbility(
  (user: any) => user?.permissions?.includes("users.create") ?? false
);
export const editUser = defineAbility(
  (user: any) => user?.permissions?.includes("users.edit") ?? false
);
export const deleteUser = defineAbility(
  (user: any) => user?.permissions?.includes("users.delete") ?? false
);

// Roles Abilities
export const readRole = defineAbility(
  (user: any) => user?.permissions?.includes("roles.read") ?? false
);
export const createRole = defineAbility(
  (user: any) => user?.permissions?.includes("roles.create") ?? false
);
export const editRole = defineAbility(
  (user: any) => user?.permissions?.includes("roles.edit") ?? false
);
export const deleteRole = defineAbility(
  (user: any) => user?.permissions?.includes("roles.delete") ?? false
);

// Devices Abilities
export const readDevice = defineAbility(
  (user: any) => user?.permissions?.includes("devices.read") ?? false
);
export const createDevice = defineAbility(
  (user: any) => user?.permissions?.includes("devices.create") ?? false
);
export const editDevice = defineAbility(
  (user: any) => user?.permissions?.includes("devices.edit") ?? false
);
export const deleteDevice = defineAbility(
  (user: any) => user?.permissions?.includes("devices.delete") ?? false
);

// Builds Abilities
export const readBuild = defineAbility(
  (user: any) => user?.permissions?.includes("builds.read") ?? false
);
export const createBuild = defineAbility(
  (user: any) => user?.permissions?.includes("builds.create") ?? false
);
export const editBuild = defineAbility(
  (user: any) => user?.permissions?.includes("builds.edit") ?? false
);
export const deleteBuild = defineAbility(
  (user: any) => user?.permissions?.includes("builds.delete") ?? false
);

// Commits Abilities
export const readCommit = defineAbility(
  (user: any) => user?.permissions?.includes("commits.read") ?? false
);
export const createCommit = defineAbility(
  (user: any) => user?.permissions?.includes("commits.create") ?? false
);
export const editCommit = defineAbility(
  (user: any) => user?.permissions?.includes("commits.edit") ?? false
);
export const deleteCommit = defineAbility(
  (user: any) => user?.permissions?.includes("commits.delete") ?? false
);

// Comments Abilities
export const readComment = defineAbility(
  (user: any) => user?.permissions?.includes("comments.read") ?? false
);
export const createComment = defineAbility(
  (user: any) => user?.permissions?.includes("comments.create") ?? false
);
export const editComment = defineAbility(
  (user: any) => user?.permissions?.includes("comments.edit") ?? false
);
export const deleteComment = defineAbility(
  (user: any) => user?.permissions?.includes("comments.delete") ?? false
);
