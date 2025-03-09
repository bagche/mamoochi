// middleware/permission.js
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useUserSession();
  const requiredPermission = to.meta.permission as string | undefined;

  if (
    requiredPermission &&
    !user?.value?.permissions.includes(requiredPermission)
  ) {
    return navigateTo("/403"); // Redirect to a forbidden page or an appropriate route
  }
});
