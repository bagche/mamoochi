<script setup lang="ts">
const route = useRoute();
const { locale, defaultLocale } = useI18n();

const basePath = computed(() => {
  const pathLocale = route.path.startsWith(`/${locale.value}/`)
    ? locale.value
    : defaultLocale;
  return route.path === "/" ? `/${pathLocale}` : route.path;
});

const { data } = useAsyncData(
  `home-intro-${route.path}`,
  async () => {
    return await queryCollection("logs")
      .where("intro", "=", true)
      .andWhere((query) => {
        return query.where("path", "LIKE", `${basePath.value}%`);
      })
      .order("date", "DESC")
      .first();
  },
  { default: () => null }
);
</script>

<template>
  <div class="container mx-auto">
    <div
      v-if="data"
      class="flex flex-col md:flex-row items-center gap-2 md:gap-10"
    >
      <div class="w-full md:w-1/2 flex flex-col justify-end">
        <h2
          class="text-2xl md:text-3xl hover:underline transition-colors duration-300"
        >
          <NuxtLink :to="data.path">{{ data.title }}</NuxtLink>
        </h2>
        <p class="mt-4 text-base md:text-lg text-justify">
          {{ data.description }}
        </p>
        <NuxtLink
          :to="data.path"
          class="mt-4 hover:underline transition-colors duration-300"
        >
          {{ $t("more") }}...
        </NuxtLink>
      </div>
      <nuxt-img
        :modifiers="{ fit: 'contain' }"
        preload
        loading="lazy"
        class="w-full md:w-1/2 flex justify-center"
        :src="data.thumbnail"
        :alt="data.title || 'Image'"
        :placeholder="[400]"
        sizes="100vw sm:50vw md:400px"
      />
    </div>
    <div v-else>
      <div class="flex flex-col md:flex-row items-center gap-0 md:gap-8">
        <div class="w-full md:w-1/2">
          <USkeleton class="h-8 w-3/4 rounded-md" />
          <USkeleton class="mt-4 h-4 w-full rounded-md" />
          <USkeleton class="mt-2 h-4 w-1/2 rounded-md" />
        </div>
        <div class="w-full md:w-1/2">
          <USkeleton class="w-full max-w-md h-64 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>
