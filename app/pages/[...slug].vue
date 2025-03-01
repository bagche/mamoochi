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
          class="flex flex-col gap-5 text-center pt-15 pb-10 border-b border-gray-200 dark:border-slate-700 dark:bg-slate-600 bg-gray-100 min-h-[calc(100vh-2rem)] items-center justify-around"
        >
          <div class="max-w-7xl mx-auto">
            <h1
              class="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            >
              {{ pageData.title }}
            </h1>
            <!-- Metadata Row -->
            <div
              class="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300"
            >
              <span v-if="pageData?.author" class="font-medium"
                >{{ $t("Author: ") }}
                <span class="normal-case">{{ pageData.author }}</span></span
              >
              <span v-if="pageData?.category" class="font-medium"
                >{{ $t("Category: ") }}
                <span class="normal-case">{{
                  $t(pageData?.category) ?? pageData?.category
                }}</span></span
              >
              <span v-if="pageData?.date" class="font-medium"
                >{{ $t("Date: ") }}
                <span class="normal-case">{{
                  formatDateTime(pageData.date)
                }}</span></span
              >
            </div>
            <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
              {{ pageData.description }}
            </p>
          </div>
          <!-- Poster Image -->
          <nuxt-img
            v-if="pageData.thumbnail"
            preload
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 700px"
            class="object-cove h-[calc(100vh-24rem)] max-w-7xl rounded-lg"
            :src="pageData.thumbnail"
            :alt="pageData.title"
            :placeholder="[600]"
          />
        </div>
      </template>

      <!-- Main Content Section -->
      <UContainer>
        <div class="max-w-7xl mx-auto flex flex-col items-center pt-10">
          <ContentRenderer
            :value="pageData"
            class="prose prose-base sm:prose-xl dark:prose-invert w-full max-w-4xl"
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
