// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();
  const localePath = useLocalePath(); // For locale-aware redirects

  // Regex to match login and register route names across locales
  const authRoutePattern = /^(login|register)(___[a-z]{2})?$/;

  // Check if the current route matches login or register
  const isAuthRoute = authRoutePattern.test(to.name?.toString() || "");

  // If user is logged in and trying to access login/register, redirect to manage
  if (loggedIn.value && isAuthRoute) {
    return navigateTo(localePath("manage"));
  }

  // If user is not logged in, allow navigation to continue
  if (!loggedIn.value) {
    return;
  }
});
