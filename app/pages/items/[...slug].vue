<script lang="ts" setup>
// Define the expected type of your page data
interface Page {
  title: string;
  description: string;
  thumbnail: string;
  stem?: string;
  // add any other expected properties here
}

// Get the current locale and available locales from i18n
const { locale, availableLocales } = useI18n();
// Get the current route
const route = useRoute();

/**
 * Compute a normalized path by removing a locale prefix if present.
 * This supports any locale by checking if the first segment is a known locale
 * (via availableLocales if provided, or if it matches the current locale).
 */
const normalizedPath = computed<string>(() => {
  // Split the path into segments and remove any empty strings
  const segments = route.path.split("/").filter(Boolean);

  // If availableLocales is defined and the first segment is one of them, remove it.
  if (availableLocales && availableLocales.includes(segments[0])) {
    segments.shift();
  } else if (segments[0] === locale.value) {
    // Fallback: if the first segment exactly matches the current locale, remove it.
    segments.shift();
  }

  // If there are no segments left, default to "index".
  return segments.length === 0 ? "index" : segments.join("/");
});

/**
 * Create the mdFile pattern for the query.
 * The pattern starts with a "%" wildcard, followed by the normalized path,
 * and ends with the current locale extension.
 */
const mdFile = computed<string>(() => {
  return `%${normalizedPath.value}.${locale.value}`;
});

// Create a unique async data key including the full route and current locale.
// This ensures that changing the locale or navigating to a new route triggers a refetch.
const asyncDataKey = `page-${route.fullPath}-${locale.value}`;

// Fetch the page data using useAsyncData with proper error handling.
const { data: page, error } = await useAsyncData<Page | null>(
  asyncDataKey,
  async () => {
    try {
      // Query the "content" collection using the LIKE pattern.
      const result = await queryCollection("content")
        .where("path", "LIKE", mdFile.value)
        .first();
      return result;
    } catch (err) {
      console.error("Error fetching page data:", err);
      return null;
    }
  },
  // Ensure that this async fetch runs on the server as well.
  { server: true }
);

// Log any errors encountered during the data fetch.
if (error.value) {
  console.error("Failed to fetch page data:", error.value);
}

// Set SEO meta tags if page data is present.
if (page.value) {
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
  });
}
</script>

<template>
  <div v-if="page" class="pt-10">
    <div class="text-center max-w-8xl flex flex-col gap-3">
      <h1 class="text-5xl pb-5">{{ page.title }}</h1>
      <p class="bg-gray-200 p-4 text-lg max-w-7xl mx-auto dark:bg-slate-800">
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
