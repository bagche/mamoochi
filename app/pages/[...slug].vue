<script lang="ts" setup>
const { locale, defaultLocale, t } = useI18n();
const route = useRoute();

// Fetch content with useAsyncData
const { data: pageData, error }: any = await useAsyncData(
  `page:${route.path}`,
  async () => {
    try {
      let path = route.path; // e.g. "/fa/" or "/en/about"
      if (path !== "/" && path.endsWith("/")) {
        path = path.slice(0, -1); // "/fa" or "/en/about"
      }

      return await $fetch("/api/content/single", {
        query: {
          path: path === "/" ? "/" + defaultLocale + "/" : path,
        },
      });
    } catch (error) {
      console.error("Error fetching page content:", error);
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
      });
    }
  },
  {
    dedupe: "defer",
    transform: (data) => data || null,
    lazy: false,
    server: true,
  }
);

// Set SEO metadata only if pageData exists
useSeoMeta({
  title: pageData.value?.title ?? t("Page Not Found"),
  description: pageData.value?.description ?? t("Page Not Found"),
  ogTitle: pageData.value?.title ?? t("Page Not Found"),
  ogDescription: pageData.value?.description ?? t("Page Not Found"),
  ogImage: pageData.value?.thumbnail ?? "/icons/android-chrome-512x512.png",
});
</script>

<template>
  <div class="w-full min-h-screen">
    <div v-if="pageData && !error" class="w-full">
      <template v-if="pageData.thumbnail">
        <div
          class="page-header flex flex-col gap-6 text-center pt-12 pb-6 md:pb-12 md:min-h-[50vh] items-center justify-between text-gray-600 border-gray-200 bg-gray-100"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
            >
              {{ pageData.title }}
            </h1>
            <div
              class="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base mb-6"
            >
              <span
                v-if="pageData?.author"
                class="font-medium whitespace-nowrap"
              >
                {{ $t("Author:") }}
                <span class="normal-case">{{ pageData.author }}</span>
              </span>
              <span v-if="pageData?.cat" class="font-medium whitespace-nowrap">
                {{ $t("Category:") }}
                <NuxtLink
                  :to="`/${locale}/cats/${pageData.cat}`"
                  class="hover:!underline transition-colors duration-300"
                >
                  {{ $t(pageData.cat) ?? pageData.cat }}
                </NuxtLink>
              </span>
              <span v-if="pageData?.date" class="font-medium whitespace-nowrap">
                {{ $t("Date:") }}
                <span class="normal-case">{{
                  formatDateTime(pageData.date)
                }}</span>
              </span>
            </div>
            <p class="mt-4 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              {{ pageData.description }}
            </p>
          </div>

          <nuxt-img
            v-if="pageData.thumbnail"
            provider="cloudflare"
            preload
            loading="lazy"
            placeholder
            sizes="sm:100vw md:80vw lg:800px"
            class="w-full max-w-7xl max-h-[50vh] h-auto object-contain md:rounded-lg"
            :src="pageData.thumbnail"
            :alt="pageData.title"
          />
        </div>
      </template>

      <UContainer>
        <div
          class="maxStorage-w-3xl mx-auto flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose-base md:prose-lg dark:prose-invert"
        >
          <PageToc
            v-if="pageData.toc"
            :toc-data="pageData.tocData"
            :comments="pageData.comments"
          />
          <MDC :value="pageData?.body" tag="div" class="w-full" />
          <Comments v-if="pageData.comments" />
        </div>
      </UContainer>
    </div>

    <NotFound v-else class="w-full" />
  </div>
</template>
