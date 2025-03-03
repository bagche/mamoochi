<script setup lang="ts">
const { locale, defaultLocale } = useI18n();
const route = useRoute();

const { data } = useAsyncData(`home-archives-${route.path}`, () =>
  queryCollection("notes")
    .where("path", "LIKE", `/${locale.value ?? defaultLocale}/%`)
    .limit(10)
    .all()
);
</script>

<template>
  <div class="w-full">
    <h2 class="mt-0">{{ $t("Latest Incoming") }}</h2>

    <div v-if="data" class="px-5 md:m-0">
      <ol>
        <li v-for="item in data" :key="item.id" class="mb-2">
          <div class="flex justify-start gap-2">
            <NuxtLink :to="item.path" class="hover:underline">
              {{ item.title }}
            </NuxtLink>
            <span class="font-thin text-">
              / {{ formatDateTime(item.date) }}
            </span>
            <span v-if="item.category" class="font-thin">
              / {{ $t(item.category) ?? item.category }}
            </span>
          </div>
        </li>
      </ol>
    </div>
    <p v-else>{{ $t("Noting is Here :(") }}</p>
  </div>
</template>
