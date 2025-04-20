<script lang="ts" setup>
const { profile, loggedIn } = useUser();
const { locale, t } = useI18n();

// Set SEO metadata based on profile
useSeoMeta({
  title: profile.value?.displayName ?? t("User Profile"),
  description: profile.value?.about ?? t("User profile page"),
  ogTitle: profile.value?.displayName ?? t("User Profile"),
  ogDescription: profile.value?.about ?? t("User profile page"),
  ogImage: profile.value?.avatar ?? "/icons/android-chrome-512x512.png",
});
</script>

<template>
  <div class="w-full min-h-screen">
    <div v-if="profile" class="w-full">
      <div
        class="w-full page-header flex flex-col gap-4 sm:gap-6 pt-8 pb-6 md:pb-12 md:min-h-[50vh] items-center justify-between text-gray-600 border-gray-200 bg-gray-100"
      >
        <div
          class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 md:justify-around"
        >
          <div
            class="w-full md:w-1/2 flex flex-col justify-end order-1 md:order-none md:gap-20"
          >
            <h1
              class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold transition-colors duration-300"
            >
              {{ profile.displayName }}
            </h1>
            <p class="mt-4 text-base sm:text-lg md:text-xl text-justify">
              {{ profile.about }}
            </p>
            <p class="mt-4 text-base sm:text-lg transition-colors duration-300">
              {{ profile.pub }}...
            </p>
          </div>
          <UAvatar
            icon="i-lucide-user"
            placeholder
            provider="cloudflare"
            :modifiers="{ fit: 'contain' }"
            preload
            class="min-w-80 min-h-80 w-full md:w-1/2 max-h-[30vh] h-auto object-contain md:rounded-lg order-2 md:order-none"
            loading="lazy"
            size="3xl"
          />
        </div>
      </div>

      <UContainer>
        <div
          class="max-w-3xl mx-auto flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base md:prose-lg dark:prose-invert"
        >
          data
        </div>
      </UContainer>
    </div>

    <NotFound v-else class="w-full" />
  </div>
</template>
