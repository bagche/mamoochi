<script lang="ts" setup>
const { locale, availableLocales, defaultLocale } = useI18n();
const route = useRoute();

const mdFile = computed(() => {
  return route.path === "/" ? `/${defaultLocale}/` : `${route.path}`;
});

// Fetch base page data.
const { data: pageData } = await useAsyncData(
  `page:${route.path}`,
  async () => {
    try {
      return await queryCollection("content")
        // .where("path", "LIKE", mdFile.value)
        .path(mdFile.value)
        .first();
    } catch (error) {
      console.error("Error fetching page content:", error);
      return null;
    }
  }
);
</script>

<template>
  <div class="mt-10">
    <!-- Display page content if available -->
    <div v-if="pageData">
      <!-- <template v-if="isItems">
        <div class="max-w-8xl flex flex-col gap-3 text-center">
          <h1 class="text-5xl pb-5">{{ pageData.title }}</h1>
          <p
            class="bg-gray-200 p-4 text-lg max-w-7xl mx-auto dark:bg-slate-800"
          >
            {{ pageData.description }}
          </p>
        </div>
        <nuxt-img
          v-if="pageData.thumbnail"
          preload
          loading="lazy"
          sizes="sm:100vw md:400vw lg:1200px"
          class="w-full bg-gray-200 mt-10"
          :src="pageData.thumbnail"
          :alt="pageData.title"
          placeholder="/placeholder.jpg"
        />
      </template> -->

      <UContainer>
        <div class="flex max-w-7xl mx-auto gap-10">
          <ContentRenderer
            :value="pageData"
            class="prose prose-xl dark:prose-invert flex-1 w-full"
          />
          <!-- <div
            v-if="isItems"
            class="w-[20rem] bg-gray-100 p-10 text-xl dark:bg-slate-800"
          >
            tools
          </div> -->
        </div>
      </UContainer>
      <Can :ability="editPage">
        <HelperStart v-if="pageData && pageData.stem" :path="pageData.stem" />
      </Can>
    </div>

    <!-- Show loading state if data is not yet available -->
    <div v-else class="text-center">Loading...</div>
  </div>
</template>
