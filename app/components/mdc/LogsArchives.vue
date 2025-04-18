<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();

const props = defineProps({
  cat: { type: String, required: false, default: "" },
});

const { data, error } = await useAsyncData(
  `logs-archives-${route.path}-${props.cat}`,
  async () => {
    try {
      const response = await $fetch("/api/content/query", {
        query: {
          ...(props.cat && { cat: props.cat }), // Include cat if provided
          sortBy: "date",
          sortOrder: "DESC",
          limit: 20,
          locale: locale.value,
        },
      });
      // Response is { status: 200, data: [...] }
      return response.data || null;
    } catch (e) {
      console.error("Error fetching logs archives:", e);
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
  <div class="w-full">
    <h2 class="mt-0">
      {{ cat ? $t("Latest ") + $t(cat) : $t("Latest Incoming") }}
    </h2>

    <div v-if="data && data.length" class="px-5 md:m-0">
      <ol>
        <li v-for="item in data" :key="item.path" class="mb-2">
          <div class="md:inline-flex">
            <NuxtLink :to="item.path" class="hover:!underline">
              {{ item.title }}
            </NuxtLink>
            <span class="font-thin block">
              / {{ formatDateTime(item.date) }}
            </span>
            <NuxtLink
              v-if="item.cat"
              :to="`/${locale}/cats/${item.cat}`"
              class="hover:!underline transition-colors duration-300 font-thin"
            >
              /
              {{ $t(item.cat) ?? item.cat }}
            </NuxtLink>
          </div>
        </li>
      </ol>
    </div>
    <p v-else>{{ $t("Noting is Here :(") }}</p>
  </div>
</template>
