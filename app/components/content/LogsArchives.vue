<script setup lang="ts">
const { locale, defaultLocale } = useI18n();
const route = useRoute();

const props = defineProps({
  cat: { type: String, required: false, default: "" },
});

const { data } = useAsyncData(`home-archives-${route.path}`, () => {
  const logsQuery = queryCollection("logs");
  if (props.cat) {
    logsQuery.where("cat", "=", props.cat);
  }

  return (
    logsQuery
      .andWhere((query) => {
        return query.where(
          "path",
          "LIKE",
          `/${locale.value ?? defaultLocale}/%`
        );
      })
      // .where("path", "LIKE", `/${locale.value ?? defaultLocale}/%`)
      .limit(10)
      .all()
  );
});
</script>

<template>
  <div class="w-full">
    <h2 class="mt-0">
      {{ cat ? $t("Latest ") + $t(cat) : $t("Latest Incoming") }}
    </h2>

    <div v-if="data" class="px-5 md:m-0">
      <ol>
        <li v-for="item in data" :key="item.id" class="mb-2">
          <div class="flex justify-start gap-2">
            <NuxtLink :to="item.path" class="hover:!underline">
              {{ item.title }}
            </NuxtLink>
            <span class="font-thin"> / {{ formatDateTime(item.date) }} </span>
            <NuxtLink
              v-if="item.cat"
              :to="`cats/${item.cat}`"
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
