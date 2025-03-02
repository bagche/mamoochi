export const readDashboard = defineAbility((user: any) => {
  // return user?.permissions?.includes("dashboard.read") ?? false;
  return true;
});

export const editPage = defineAbility((user: any) => {
  return user?.permissions?.includes("page.edit") ?? false;
});
