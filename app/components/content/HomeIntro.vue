<script setup lang="ts">
const { locale, defaultLocale } = useI18n();

const { data } = await useAsyncData(
  `home-intro`,
  async () =>
    await queryCollection("items")
      .where("path", "LIKE", `/${locale.value ?? defaultLocale}/%`)
      .first()
);
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row items-center gap-0 md:gap-8">
      <!-- Content Section -->
      <div class="w-full md:w-1/2 flex flex-col justify-center">
        <h2
          class="text-2xl md:text-3xl font-semibold mt-2 hover:underline transition-colors duration-300"
        >
          <NuxtLink :to="data?.path" class="">
            {{ data?.title }}
          </NuxtLink>
        </h2>
        <p class="mt-4 text-base md:text-lg">
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
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          class="w-full max-w-xl rounded-lg object-cover"
          :src="data?.thumbnail"
          :alt="data?.title || 'Image'"
          :placeholder="[300]"
        />
      </div>
    </div>
  </div>
</template>
