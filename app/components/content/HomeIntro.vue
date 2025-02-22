<script setup lang="ts">
const { locale, defaultLocale } = useI18n();

const { data } = await useAsyncData(`home-intro-${locale.value}`, () =>
  queryCollection("items")
    .where("path", "LIKE", `/${locale.value ?? defaultLocale}/%`)
    .first()
);
</script>

<template>
  <div class="flex flex-col md:flex-row items-center h-screen-md gap-4">
    <div class="md:w-1/2 flex flex-col items-start">
      <h2 class="mt-2">
        <NuxtLink :to="data?.path?.slice(0, -3)" class="hover:underline">
          {{ data?.title }}
        </NuxtLink>
      </h2>
      <p>{{ data?.description }}</p>
      <NuxtLink :to="data?.path?.slice(0, -3)" class="hover:underline">
        {{ $t("more") }}...
      </NuxtLink>
    </div>
    <div class="md:w-1/2 flex justify-end mt-10 md:mt-0">
      <nuxt-img
        preload
        loading="lazy"
        sizes="sm:100vw md:80vw lg:500px"
        class="w-full"
        :src="data?.thumbnail"
        :alt="data?.title"
        :placeholder="[600]"
      />
    </div>
  </div>
</template>
