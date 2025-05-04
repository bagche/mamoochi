<script lang="ts" setup>
const { t, locale } = useI18n();
const appConfig = useAppConfig();

useSeoMeta({
  title: t("Register User"),
  description: t(
    "Create a new account to start exploring our platform's features."
  ),
  ogTitle: t("Register User"),
  ogDescription: t(
    "Create a new account to start exploring our platform's features."
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
              <h1>{{ t("Join Our Platform!") }}</h1>
              <p>
                {{
                  $t(
                    "Sign up today to create your account and gain access to our powerful tools, personalized dashboard, and a community of users. Start your journey with us in just a few steps."
                  )
                }}
              </p>
            </div>
            <h2>{{ t("Create Account") }}</h2>
            <AuthRegisterForm />
            <div class="text-sm text-center">
              {{ $t("Already have an account?") }}
              <NuxtLink
                to="/login"
                class="text-primary underline hover:text-primary-700"
              >
                {{ $t("Login") }}
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
            :alt="$t('Register Page')"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
