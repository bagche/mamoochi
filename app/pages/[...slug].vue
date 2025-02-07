<script lang="ts" setup>
const { locale, availableLocales } = useI18n();
const route = useRoute();

const normalizedPath = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  if (availableLocales && availableLocales.includes(segments[0]))
    segments.shift();
  else if (segments[0] === locale.value) segments.shift();
  return segments.length ? segments.join("/") : "index";
});

const mdFile = computed(() => `%${normalizedPath.value}.${locale.value}`);
const collection = computed(() =>
  route.path.includes("/items") ? "items" : "content"
);
const isItems = computed(() => collection.value === "items");
const asyncDataKey = `page-${route.fullPath}-${locale.value}`;

const { data: page, error } = await useAsyncData(
  asyncDataKey,
  async () => {
    try {
      return await queryCollection(collection.value)
        .where("path", "LIKE", mdFile.value)
        .first();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  { server: true }
);

if (error.value) console.error(error.value);
if (page.value) {
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
  });
}
</script>

<template>
  <div v-if="page">
    <template v-if="isItems">
      <div class="pt-10">
        <div class="text-center max-w-8xl flex flex-col gap-3">
          <h1 class="text-5xl pb-5">{{ page.title }}</h1>
          <p
            class="bg-gray-200 p-4 text-lg max-w-7xl mx-auto dark:bg-slate-800"
          >
            {{ page.description }}
          </p>
        </div>
        <nuxt-img
          preload
          loading="lazy"
          sizes="sm:100vw md:400vw lg:1200px"
          class="w-full bg-gray-200 mt-10"
          :src="page.thumbnail"
          :alt="page.title"
          :placeholder="[800]"
        />
        <UContainer>
          <div class="flex max-w-7xl mx-auto gap-10">
            <ContentRenderer
              :value="page"
              class="prose prose-xl dark:prose-invert mt-10"
            />
            <div class="w-[50rem] bg-gray-100 p-10 text-xl dark:bg-slate-800">
              tools
            </div>
          </div>
        </UContainer>
        <HelperStart :path="page.stem" />
      </div>
    </template>
    <template v-else>
      <UContainer>
        <div class="flex max-w-7xl mx-auto gap-10">
          <ContentRenderer
            :value="page"
            class="prose prose-xl dark:prose-invert mt-10"
          />
        </div>
      </UContainer>
      <HelperStart :path="page.stem" />
    </template>
  </div>
</template>
