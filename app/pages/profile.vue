<script lang="ts" setup>
const { profile, generateNewNames, loggedIn } = useUser();
const { loggedIn: sessionLoggedIn } = useUserSession();

const { t } = useI18n();
const appConfig = useAppConfig();

const updateProfileIsOpen = ref(false);
const changePasswordIsOpen = ref(false);

// Set SEO metadata based on profile
useSeoMeta({
  title: profile.value?.displayName ?? t("User Profile"),
  description: profile.value?.about ?? t("User profile page"),
  ogTitle: profile.value?.displayName ?? t("User Profile"),
  ogDescription: profile.value?.about ?? t("User profile page"),
  ogImage: appConfig.app.default_avatar,
});
</script>

<template>
  <div class="w-full min-h-screen">
    <div v-if="profile" class="w-full">
      <div
        class="w-full page-header flex flex-col gap-5 pt-8 pb-6 md:pb-12 md:min-h-[50vh] items-center justify-start text-gray-600 border-gray-200 bg-gray-100"
      >
        <div class="flex justify-end w-full max-w-5xl">
          <UButtonGroup>
            <UButton
              v-if="sessionLoggedIn"
              color="neutral"
              variant="subtle"
              :label="$t('Change Password')"
              @click="changePasswordIsOpen = true"
            />
            <UButton
              v-if="sessionLoggedIn"
              color="neutral"
              variant="subtle"
              :label="$t('Update Profile')"
              @click="changePasswordIsOpen = true"
            />
            <UButton
              v-if="loggedIn"
              color="neutral"
              variant="subtle"
              :label="$t('New Random Name')"
              @click="generateNewNames"
            />
          </UButtonGroup>
        </div>
        <div
          class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 md:justify-around"
        >
          <div class="w-full md:w-1/2 flex flex-col justify-end md:gap-20">
            <h1
              class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold transition-colors duration-300"
            >
              {{ profile.displayName }}
            </h1>
            <p class="mt-4 text-base sm:text-lg md:text-xl text-justify">
              {{ profile.about }}
            </p>
          </div>
          <nuxt-img
            placeholder
            :modifiers="{ fit: 'contain' }"
            preload
            class="w-full md:w-1/2 max-h-[40vh] h-auto object-contain md:rounded-lg"
            loading="lazy"
            :src="appConfig.app.default_banner"
          />
        </div>
      </div>

      <UContainer>
        <div
          class="max-w-3xl mx-auto flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base md:prose-lg dark:prose-invert"
        >
          <UsersProfileTabs />
        </div>
      </UContainer>

      <UModal
        v-if="sessionLoggedIn"
        v-model:open="changePasswordIsOpen"
        :title="$t('Change Password')"
      >
        <template #body>
          <AuthChangePasswordForm @close-modal="changePasswordIsOpen = false" />
        </template>
      </UModal>
      <UModal
        v-if="sessionLoggedIn"
        v-model:open="updateProfileIsOpen"
        :title="$t('Update Profile')"
      >
        <template #body>
          <AuthUpdateProfileForm @close-modal="updateProfileIsOpen = false" />
        </template>
      </UModal>
    </div>

    <NotFound v-else class="w-full" />
  </div>
</template>
