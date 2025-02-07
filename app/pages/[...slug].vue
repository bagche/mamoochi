<script lang="ts" setup>
const { locale, availableLocales } = useI18n();
const route = useRoute();

// Simplified path normalization
const normalizedPath = computed(() => {
  const path = route.path.replace(
    new RegExp(`^/(${availableLocales.join("|")})`),
    ""
  );
  return path.endsWith("/") ? path.slice(0, -1) || "index" : path || "index";
});

const mdFile = computed(
  () => `%${normalizedPath.value.replace(/^\//, "")}.${locale.value}`
);
const isItems = computed(() => route.path.startsWith("/items"));
const collection = computed(() => (isItems.value ? "items" : "content"));

const { data: page, error } = await useAsyncData(
  `page:${route.path}:${locale.value}`,
  () =>
    queryCollection(collection.value)
      .where("path", "LIKE", mdFile.value)
      .first()
      .catch((err) => console.error(err) || null)
);

useSeoMeta(
  page.value
    ? {
        title: page.value.title,
        description: page.value.description,
      }
    : {
        title: "Default Page Title",
        description: "Default page description",
      }
);

// Simple error handling
if (error.value) showError({ statusCode: 404 });
</script>

<template>
  <div v-if="page">
    <div class="pt-10">
      <template v-if="isItems">
        <div class="max-w-8xl flex flex-col gap-3 text-center">
          <h1 class="text-5xl pb-5">{{ page.title }}</h1>
          <p
            class="bg-gray-200 p-4 text-lg max-w-7xl mx-auto dark:bg-slate-800"
          >
            {{ page.description }}
          </p>
        </div>
        <nuxt-img
          v-if="page.thumbnail"
          preload
          loading="lazy"
          sizes="sm:100vw md:400vw lg:1200px"
          class="w-full bg-gray-200 mt-10"
          :src="page.thumbnail"
          :alt="page.title"
          placeholder="/placeholder.jpg"
        />
      </template>

      <UContainer>
        <div class="flex max-w-7xl mx-auto gap-10">
          <ContentRenderer
            :value="page"
            class="prose prose-xl dark:prose-invert mt-10 flex-1 w-full"
          />
          <div
            v-if="isItems"
            class="w-[20rem] bg-gray-100 p-10 text-xl dark:bg-slate-800"
          >
            tools
          </div>
        </div>
      </UContainer>

      <HelperStart v-if="page.stem" :path="page.stem" />
    </div>
  </div>
</template>
