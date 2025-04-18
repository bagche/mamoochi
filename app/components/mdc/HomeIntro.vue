<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();

const { data, error } = await useAsyncData(
  `home-intro-${route.path}`,
  async () => {
    try {
      const response = await $fetch("/api/content/query", {
        query: {
          intro: true,
          sortBy: "date",
          sortOrder: "DESC",
          limit: 1,
          locale: locale.value,
        },
      });
      // Response is { status: 200, data: [...] }
      return response.data[0] || null;
    } catch (e) {
      console.error("Error fetching home intro:", e);
      return null;
    }
  },
  {
    dedupe: "defer",
    lazy: false,
    server: true,
  }
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
        provider="cloudflare"
        :modifiers="{ fit: 'contain' }"
        preload
        loading="lazy"
        class="w-full md:w-1/2 flex justify-center max-w-7xl md:rounded-sm"
        :src="data.thumbnail"
        :alt="data.title || 'Image'"
        placeholder
        sizes="(max-width: 4080x) 100vw, 400px"
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
