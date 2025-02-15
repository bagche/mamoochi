<script lang="ts" setup>
/**
 * Returns the normalized path by removing any locale prefix.
 */
function getNormalizedPath(routePath: string, locales: string[]): string {
  const pattern = new RegExp(`^/(${locales.join("|")})`);
  const stripped = routePath.replace(pattern, "");
  return stripped.endsWith("/")
    ? stripped.slice(0, -1) || "index"
    : stripped || "index";
}

/**
 * Builds a markdown lookup key from the normalized path and current locale.
 */
function buildMarkdownLookup(normalizedPath: string, locale: string): string {
  // Remove any leading slash and format like: %<path>.<locale>
  return `%${normalizedPath.replace(/^\//, "")}.${locale}`;
}

// ----- Setup Reactive Data -----
const { locale, availableLocales } = useI18n();
const route = useRoute();

// Compute normalized path & markdown lookup key.
const normalizedPath = computed(() =>
  getNormalizedPath(route.path, availableLocales)
);
const mdFile = computed(() =>
  buildMarkdownLookup(normalizedPath.value, locale.value)
);

// Determine which collection to query.
const isItems = computed(() => route.path.startsWith("/items"));
const collection = computed(() => (isItems.value ? "items" : "content"));

// ----- Fetch Base Page Data -----
const { data: pageData, error: contentError } = await useAsyncData(
  `page:${route.path}:${locale.value}`,
  () =>
    queryCollection(collection.value)
      .where("path", "LIKE", mdFile.value)
      .first()
      .catch((err) => {
        console.error("Error fetching page content:", err);
        return null;
      })
);

// ----- Fetch Edit Record, if available -----
// Only attempt to fetch an edit if pageData contains a valid stem.
const { data: editData, error: editError } = await useAsyncData(
  `edit:${mdFile.value}`,
  async () => {
    if (!pageData.value || !pageData.value.stem) return null;
    const response = await $fetch(
      `/api/editor/single?path=${encodeURIComponent(pageData.value.stem)}`
    );
    if (response && response.body) {
      return await parseMarkdownText(response.body);
    }
    return null;
  }
);

// ----- Combine Data -----
// Use editData if available (and has a body); otherwise, fall back to pageData.
const finalPage = computed(() => {
  if (pageData.value) {
    return editData.value && editData.value
      ? { ...pageData.value, ...editData.value }
      : pageData.value;
  }
  return null;
});

// ----- Set SEO Meta and Handle Errors -----
useSeoMeta(
  finalPage.value
    ? {
        title: finalPage.value.title,
        description: finalPage.value.description,
      }
    : {
        title: "Default Page Title",
        description: "Default page description",
      }
);

if (
  (!finalPage.value || !finalPage.value.title) &&
  (contentError.value || editError.value)
) {
  showError({ statusCode: 404 });
}
</script>

<template>
  <div v-if="finalPage" class="mt-10">
    <template v-if="isItems">
      <div class="max-w-8xl flex flex-col gap-3 text-center">
        <h1 class="text-5xl pb-5">{{ finalPage.title }}</h1>
        <p class="bg-gray-200 p-4 text-lg max-w-7xl mx-auto dark:bg-slate-800">
          {{ finalPage.description }}
        </p>
      </div>
      <nuxt-img
        v-if="finalPage.thumbnail"
        preload
        loading="lazy"
        sizes="sm:100vw md:400vw lg:1200px"
        class="w-full bg-gray-200 mt-10"
        :src="finalPage.thumbnail"
        :alt="finalPage.title"
        placeholder="/placeholder.jpg"
      />
    </template>

    <UContainer>
      <div class="flex max-w-7xl mx-auto gap-10">
        <ContentRenderer
          :value="finalPage"
          class="prose prose-xl dark:prose-invert flex-1 w-full"
        />
        <div
          v-if="isItems"
          class="w-[20rem] bg-gray-100 p-10 text-xl dark:bg-slate-800"
        >
          tools
        </div>
      </div>
    </UContainer>
    <Can :ability="editPage">
      <HelperStart v-if="finalPage && finalPage.stem" :path="finalPage.stem" />
    </Can>
  </div>
</template>
