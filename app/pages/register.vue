<script lang="ts" setup>
const { t } = useI18n();

// // Set SEO metadata based on profile
useSeoMeta({
  title: t("Register User"),
  description: t("Register User"),
  ogTitle: t("Register User"),
  ogDescription: t("Register User"),
  ogImage: "/icons/android-chrome-512x512.png",
});
</script>

<template>
  <div class="w-full min-h-screen">
    <UContainer>
      <div
        class="max-w-3xl mx-auto flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base md:prose-lg dark:prose-invert"
      >
        <AuthRegisterForm />
      </div>
    </UContainer>
  </div>
</template>
