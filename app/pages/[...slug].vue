<script lang="ts" setup>
// Define the expected shape of your page data.
interface Page {
  title: string;
  description: string;
  stem?: string;
  // Add additional fields as needed.
}

// Get the current locale and available locales from i18n.
const { locale, availableLocales } = useI18n();
// Get the current route.
const route = useRoute();

/**
 * Compute a normalized path by removing the locale prefix if present.
 * Splits the path into segments and, if the first segment is one of the
 * available locales (or matches the current locale), it is removed.
 * Defaults to "index" if no segments remain.
 */
const normalizedPath = computed<string>(() => {
  const segments = route.path.split("/").filter(Boolean);

  // Remove the first segment if it matches a known locale.
  if (availableLocales && availableLocales.includes(segments[0])) {
    segments.shift();
  } else if (segments[0] === locale.value) {
    segments.shift();
  }

  return segments.length ? segments.join("/") : "index";
});

/**
 * Create the file query pattern.
 * The pattern starts with "%" as a wildcard, followed by the normalized path,
 * and ending with the current locale extension.
 */
const mdFile = computed<string>(
  () => `%${normalizedPath.value}.${locale.value}`
);

// Create a unique key for useAsyncData using the full route and current locale.
// This ensures that the data is re-fetched when the locale or route changes.
const asyncDataKey = `page-${route.fullPath}-${locale.value}`;

// Fetch the page data with proper error handling.
// The query uses a "LIKE" pattern to match the path.
const { data: page, error } = await useAsyncData<Page | null>(
  asyncDataKey,
  async () => {
    try {
      return await queryCollection("content")
        .where("path", "LIKE", mdFile.value)
        .first();
    } catch (err) {
      console.error("Error fetching page data:", err);
      return null;
    }
  },
  { server: true }
);

// Log any errors encountered during the data fetch.
if (error.value) {
  console.error("useAsyncData error:", error.value);
}

// Set SEO meta tags based on the fetched page data.
if (page.value) {
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
  });
}
</script>

<template>
  <div v-if="page">
    <UContainer>
      <div class="flex max-w-7xl mx-auto gap-10">
        <ContentRenderer
          :value="page"
          class="prose prose-xl dark:prose-invert mt-10"
        />
      </div>
    </UContainer>
    <HelperStart :path="page.stem" />
  </div>
</template>
