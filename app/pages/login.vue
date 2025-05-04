<script lang="ts" setup>
const { t } = useI18n();
const appConfig = useAppConfig();

useSeoMeta({
  title: t("Login User"),
  description: t(
    "Log in to access your personalized dashboard and manage your content seamlessly."
  ),
  ogTitle: t("Login User"),
  ogDescription: t(
    "Log in to access your personalized dashboard and manage your content seamlessly."
  ),
  ogImage: appConfig.app.default_banner,
});
</script>

<template>
  <UContainer>
    <div
      class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <!-- Left Side - Form -->
        <div class="flex items-center justify-center p-8">
          <div class="w-full max-w-md space-y-6">
            <div
              class="space-y-4 prose prose-sm sm:prose-base md:prose-lg dark:prose-invert"
            >
              <h1>{{ t("Welcome Back!") }}</h1>
              <p>
                {{
                  $t(
                    "Log in to your account to access your personalized dashboard, manage your content, and unlock a world of features designed to make your experience seamless and productive."
                  )
                }}
              </p>
            </div>
            <h2>{{ t("Sign In") }}</h2>
            <AuthLoginForm />
            <div class="text-sm text-center">
              {{ $t("Don't have an account?") }}
              <NuxtLink
                to="/register"
                class="text-primary underline hover:text-primary-700"
              >
                {{ $t("Register") }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- Right Side - Image -->
        <div class="flex items-center justify-center p-8">
          <nuxt-img
            provider="cloudflare"
            preload
            loading="lazy"
            placeholder
            class="w-full max-w-md h-auto object-contain rounded-lg mx-auto"
            :src="appConfig.app.default_banner"
            :alt="$t('Login Page')"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
