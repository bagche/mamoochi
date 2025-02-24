<script lang="ts" setup>
const { defaultLocale } = useI18n();
const route = useRoute();

// Fetch page content dynamically
const { data: pageData } = await useAsyncData(
  `page:${route.path}`,
  async () => {
    try {
      const pathway =
        route.path === "/" ? `/${defaultLocale ?? "fa"}/` : route.path;
      return await queryCollection("content").path(pathway).first();
    } catch (error) {
      console.error("Error fetching page content:", error);
      return null;
    }
  }
);

// Set dynamic page metadata (SEO)
useSeoMeta({
  title: pageData.value?.title,
  description: pageData.value?.description,
});
</script>

<template>
  <div class="w-full min-h-screen">
    <!-- Show content if available -->
    <div v-if="pageData" class="w-full">
      <!-- Special Section for 'notes/' Pages -->
      <template v-if="pageData.thumbnail">
        <div
          class=" flex flex-col gap-3 text-center pt-15 pb-10 mb-10 border-b border-gray-200 dark:border-slate-700 dark:bg-slate-600 bg-gray-100"
        >
          <div class="max-w-7xl mx-auto">
            <h1
              class="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white"
            >
              {{ pageData.title }}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mt-3">
              {{ pageData.description }}
            </p>
          </div>
          <!-- Optional Thumbnail Image -->
          <nuxt-img
            v-if="pageData.thumbnail"
            preload
            loading="lazy"
            sizes="sm:100vw md:400vw lg:700px"
            class="w-full max-w-3xl mx-auto mt-6 rounded-lg shadow-md bg-gray-200 dark:bg-slate-700"
            :src="pageData.thumbnail"
            :alt="pageData.title"
            :placeholder="[600]"
          />
        </div>
      </template>

      <!-- Main Content Section -->
      <UContainer>
        <div
          class="max-w-7xl mx-auto px-5 lg:px-0 py-8 flex flex-col items-center"
        >
          <ContentRenderer
            :value="pageData"
            class="prose prose-lg sm:prose-xl dark:prose-invert w-full max-w-4xl"
          />
        </div>
      </UContainer>

      <!-- Edit Button (If User Has Permission) -->
      <Can :ability="editPage">
        <HelperStart v-if="pageData && pageData.stem" :path="pageData.stem" />
      </Can>
    </div>

    <!-- Loading State -->
    <div
      v-else
      class="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-300"
    >
      {{ $t(" Loading...") }}
    </div>
  </div>
</template>
