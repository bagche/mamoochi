<script setup lang="ts">
const { locale, defaultLocale } = useI18n();
const route = useRoute();

const { data } = await useAsyncData(
  `home-intro-${route.path}`,
  async () =>
    await queryCollection("notes")
      .where("intro", "=", true)
      .andWhere((query) => {
        return query.where(
          "path",
          "LIKE",
          `/${locale.value ?? defaultLocale}/%`
        );
      })
      .first()
);
</script>
<template>
  <div class="container mx-auto">
    <div class="flex flex-col md:flex-row items-center gap-0 md:gap-8">
      <!-- Content Section -->
      <div class="w-full md:w-1/2 flex flex-col justify-center">
        <h2
          class="text-2xl md:text-3xl hover:underline transition-colors duration-300"
        >
          <NuxtLink :to="data?.path" class="">
            {{ data?.title }}
          </NuxtLink>
        </h2>
        <p class="mt-4 text-base md:text-lg text-justify">
          {{ data?.description }}
        </p>
        <NuxtLink
          :to="data?.path"
          class="mt-4 hover:underline transition-colors duration-300"
        >
          <span class="hover:underline transition-colors duration-300">
            {{ $t("more") }}...
          </span>
        </NuxtLink>
      </div>

      <!-- Image Section -->
      <div class="w-full md:w-1/2 flex justify-center">
        <nuxt-img
          preload
          loading="lazy"
          class="w-full max-w-md rounded-lg object-cover"
          :src="data?.thumbnail"
          :alt="data?.title || 'Image'"
          :placeholder="[300]"
          sizes="100vw sm:50vw md:400px"
        />
      </div>
    </div>
  </div>
</template>
